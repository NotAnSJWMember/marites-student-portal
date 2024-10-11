import {
   Body,
   Controller,
   HttpException,
   HttpStatus,
   Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {
   constructor(
      private readonly userService: UserService,
      private readonly authService: AuthService,
   ) {}

   @Post('login')
   async login(@Body() loginData: { userId: string; password: string }) {
      const { userId, password } = loginData;

      const user = await this.userService.findOne(userId);
      if (
         !user ||
         !(await this.userService.comparePassword(password, user.password))
      ) {
         throw new HttpException(
            'Invalid credentials',
            HttpStatus.UNAUTHORIZED,
         );
      }

      const token = await this.authService.generateToken(
         user.userId,
         user.role,
      );
      return { token, message: 'Login successful' };
   }
}
