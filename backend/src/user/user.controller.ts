import {
   Controller,
   Get,
   Post,
   Body,
   Param,
   Put,
   Delete,
   HttpException,
   HttpStatus,
   HttpCode,
   UseGuards,
   Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.schema';
import { AuthService } from 'src/auth/auth.service';
import { Roles } from 'src/auth/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { MailService } from 'src/mail/mail.service';

@Controller('user')
export class UserController {
   constructor(
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
      const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;

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

      const hashedPassword = await this.userService.hashPassword(newPassword);
      await this.userService.updatePassword(user.userId, hashedPassword);
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

   @Post()
   async create(@Body() studentData: Partial<User>): Promise<User> {
      return this.userService.create(studentData);
   }

   @Get()
   @UseGuards(AuthGuard('jwt'), RolesGuard)
   @Roles('admin')
   async findAll(): Promise<User[]> {
      return this.userService.findAll();
   }

   @Get(':userId')
   @UseGuards(AuthGuard('jwt'), RolesGuard)
   @Roles('admin', 'student')
   async findOne(@Param('userId') userId: string): Promise<User> {
      const user = await this.userService.findOne(userId);

      if (!user) {
         throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
      }

      return user;
   }

   @Put(':userId')
   @UseGuards(AuthGuard('jwt'), RolesGuard)
   @Roles('admin')
   async update(
      @Param('userId') userId: string,
      @Body() userData: Partial<User>,
   ): Promise<User> {
      return this.userService.update(userId, userData);
   }

   @Delete(':userId')
   @UseGuards(AuthGuard('jwt'), RolesGuard)
   @Roles('admin')
   async delete(@Param('userId') userId: string): Promise<User> {
      return this.userService.delete(userId);
   }

   @Post('*')
   @HttpCode(HttpStatus.METHOD_NOT_ALLOWED)
   handleMethodNotAllowed() {
      throw new HttpException(
         'Method Not Allowed',
         HttpStatus.METHOD_NOT_ALLOWED,
      );
   }

   @Get('*')
   @HttpCode(HttpStatus.METHOD_NOT_ALLOWED)
   handleGetMethodNotAllowed() {
      throw new HttpException(
         'Method Not Allowed',
         HttpStatus.METHOD_NOT_ALLOWED,
      );
   }

   @Put('*')
   @HttpCode(HttpStatus.METHOD_NOT_ALLOWED)
   handlePutMethodNotAllowed() {
      throw new HttpException(
         'Method Not Allowed',
         HttpStatus.METHOD_NOT_ALLOWED,
      );
   }

   @Delete('*')
   @HttpCode(HttpStatus.METHOD_NOT_ALLOWED)
   handleDeleteMethodNotAllowed() {
      throw new HttpException(
         'Method Not Allowed',
         HttpStatus.METHOD_NOT_ALLOWED,
      );
   }
}
