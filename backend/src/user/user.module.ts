import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { IdGenerator } from './generate-id.helper';
import { MailService } from 'src/mail/mail.service';

@Module({
   imports: [
      MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
      JwtModule.register({
         secret: process.env.JWT_SECRET,
         signOptions: { expiresIn: '1h' },
      }),
      forwardRef(() => AuthModule),
   ],
   providers: [IdGenerator, UserService, MailService],
   controllers: [UserController],
   exports: [UserService],
})
export class UserModule {}
