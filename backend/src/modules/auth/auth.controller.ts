import {
   All,
   Body,
   Controller,
   HttpCode,
   HttpException,
   HttpStatus,
   Logger,
   Post,
   Query,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { MailService } from 'src/common/services/mail/mail.service';
import { User } from '../user/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { getOriginUrl } from 'src/common/utils/get-origin-url.helper';

@Controller('auth')
export class AuthController {
   private readonly logger = new Logger(AuthController.name);

   constructor(
      @InjectModel(User.name) private userModel: Model<User>,
      private readonly userService: UserService,
      private readonly authService: AuthService,
      private readonly mailService: MailService,
   ) {}

   @Post('login')
   async login(
      @Body() loginData: { userId: string; password: string },
   ): Promise<{ token: string; role: string; message: string }> {
      const { userId, password } = loginData;

      if (!userId || !password) {
         throw new HttpException(
            'Both user id and password are required',
            HttpStatus.BAD_REQUEST,
         );
      }

      this.logger.log(`Login attempt for userId: ${userId}`);

      let user = await this.userService.findByUserId(userId);

      if (!user) {
         user = await this.userService.findByUsername(userId);
      }

      if (!user) {
         throw new HttpException(
            'Invalid credentials',
            HttpStatus.UNAUTHORIZED,
         );
      }

      const checkPass = await this.userService.comparePassword(
         password,
         user.password,
      );
      if (!checkPass) {
         throw new HttpException(
            'Invalid credentials',
            HttpStatus.UNAUTHORIZED,
         );
      }

      const token = await this.authService.generateToken(
         user.userId,
         user.role,
      );

      await this.userModel.updateOne(
         { userId: user.userId },
         { $set: { lastActive: Date.now() } },
      );

      this.logger.log(
         `Login successful for ${user.firstName} at ${user.lastActive}`,
      );

      return { token, role: user.role, message: 'Login successful' };
   }

   @Post('forgot-password')
   async forgotPassword(@Body() body: { username: string }) {
      const { username } = body;
      let user = await this.userService.findByUsername(username);

      if (!user) {
         user = await this.userService.findByUserId(username);
      }

      if (!user) {
         throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      const resetToken = await this.authService.generateResetToken(user.userId);
      const originUrl = getOriginUrl();
      const resetLink = `${originUrl}/reset-password?token=${resetToken}`;

      try {
         await this.mailService.sendPasswordResetEmail(user.email, resetLink);
         return {
            message: 'Password reset email sent successfully.',
         };
      } catch (error) {
         console.error('Failed to send password reset email:', error);
         throw new HttpException(
            'Failed to send email. Please try again later.',
            HttpStatus.INTERNAL_SERVER_ERROR,
         );
      }
   }

   @Post('reset-password')
   async resetPassword(@Body() body: { token: string; newPassword: string }) {
      const { token, newPassword } = body;

      const userId = await this.authService.verifyResetToken(token);
      if (!userId) {
         throw new HttpException(
            'Invalid or expired reset token',
            HttpStatus.BAD_REQUEST,
         );
      }

      const user = await this.userService.findByUserId(userId);
      if (!user) {
         throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      await this.userService.updatePassword(user.userId, newPassword);

      const newToken = await this.authService.generateToken(
         user.userId,
         user.role,
      );

      return { message: 'Password updated successfully', token: newToken };
   }

   @Post('validate-reset-token')
   async validateResetToken(@Query('token') resetToken: string) {
      try {
         const userId = await this.authService.verifyResetToken(resetToken);
         return { isValid: true, userId };
      } catch (error) {
         return { isValid: false, message: error.message };
      }
   }

   @All('*')
   @HttpCode(HttpStatus.METHOD_NOT_ALLOWED)
   handleMethodNotAllowed() {
      throw new HttpException(
         'Method Not Allowed',
         HttpStatus.METHOD_NOT_ALLOWED,
      );
   }
}
