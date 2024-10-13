import * as dotenv from 'dotenv';
dotenv.config();

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MailService } from './common/services/mail/mail.service';
import { AssignmentModule } from './modules/assignment/assignment.module';
import { AuthModule } from './modules/auth/auth.module';
import { CourseModule } from './modules/course/course.module';
import { FinanceModule } from './modules/finance/finance.module';
import { NotificationModule } from './modules/notification/notification.module';
import { ScheduleModule } from './modules/schedule/schedule.module';
import { UserModule } from './modules/user/user.module';
import { DatabaseModule } from './common/database/database.module';

@Module({
   imports: [
      ConfigModule.forRoot({
         isGlobal: true,
         envFilePath: '.env',
      }),
      JwtModule.registerAsync({
         useFactory: () => ({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '1h' },
         }),
      }),
      DatabaseModule,
      AuthModule,
      UserModule,
      AssignmentModule,
      CourseModule,
      FinanceModule,
      ScheduleModule,
      NotificationModule,
   ],
   controllers: [AppController],
   providers: [AppService, MailService],
   exports: [JwtModule],
})
export class AppModule {}
