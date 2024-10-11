import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';

@Module({
   imports: [
      JwtModule.register({
         secret: process.env.JWT_SECRET,
         signOptions: { expiresIn: '1h' },
      }),
      PassportModule,
      forwardRef(() => UserModule),
   ],
   providers: [AuthService, JwtStrategy],
   controllers: [AuthController],
   exports: [AuthService],
})
export class AuthModule {}
