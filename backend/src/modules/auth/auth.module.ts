import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../user/user.schema';
import { MailService } from 'src/common/services/mail/mail.service';

@Module({
   imports: [
      MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
      PassportModule,
      forwardRef(() => UserModule),
      JwtModule.registerAsync({
         useFactory: () => ({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '1h' },
         }),
      }),
      UserModule,
   ],
   providers: [AuthService, JwtStrategy, MailService],
   controllers: [AuthController],
   exports: [AuthService],
})
export class AuthModule {}
