import * as dotenv from 'dotenv';
dotenv.config();

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { MailService } from './mail/mail.service';

@Module({
   imports: [
      ConfigModule.forRoot(),
      JwtModule.register({
         secret: process.env.JWT_SECRET,
         signOptions: { expiresIn: '1h' },
      }),
      MongooseModule.forRoot(process.env.MONGODB_URI),
      AuthModule,
      UserModule,
   ],
   controllers: [AppController],
   providers: [AppService, MailService],
})
export class AppModule {}
