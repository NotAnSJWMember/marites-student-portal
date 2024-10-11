/* eslint-disable @typescript-eslint/no-unused-vars */
import {
   Injectable,
   UnauthorizedException,
   Logger,
   BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
   private readonly logger = new Logger(AuthService.name);

   constructor(
      private readonly userService: UserService,
      private readonly jwtService: JwtService,
   ) {}

   async generateToken(userId: string, role: string): Promise<string> {
      const payload = { userId, role };
      const token = this.jwtService.sign(payload, { expiresIn: '1h' });
      this.logger.log(`Generated token for user ID: ${userId}`);
      return token;
   }

   async generateResetToken(userId: string): Promise<string> {
      const payload = { userId };
      const token = this.jwtService.sign(payload, { expiresIn: '15m' });
      this.logger.log(`Generated reset token for user ID: ${userId}`);
      return token;
   }

   async validateUser(username: string, password: string): Promise<any> {
      const user = await this.userService.findByUsername(username);
      if (
         !user ||
         !(await this.userService.comparePassword(password, user.password))
      ) {
         this.logger.warn(`Failed login attempt for username: ${username}`);
         throw new UnauthorizedException('Invalid username or password');
      }

      this.logger.log(`User validated successfully: ${username}`);
      return user;
   }

   async verifyResetToken(token: string): Promise<string | null> {
      try {
         const payload = await this.jwtService.verify(token);
         this.logger.log(`Reset token verified for user ID: ${payload.userId}`);
         return payload.userId;
      } catch (error) {
         if (error.name === 'TokenExpiredError') {
            this.logger.warn(`Reset token expired: ${token}`);
            throw new BadRequestException(
               'Reset token has expired. Please request a new one.',
            );
         }
         this.logger.error(`Failed to verify reset token: ${token}`, error);
         throw new UnauthorizedException('Invalid reset token.');
      }
   }

   async login(user: any) {
      const payload = {
         username: user.username,
         sub: user.userId,
         role: user.role,
      };

      const accessToken = await this.generateToken(user.userId, user.role);
      this.logger.log(`User logged in: ${user.username}`);

      return {
         access_token: accessToken,
         user: {
            username: user.username,
            role: user.role,
         },
      };
   }
}
