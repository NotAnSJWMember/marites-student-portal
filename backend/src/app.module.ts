import * as dotenv from 'dotenv';
dotenv.config();

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './common/database/database.module';
import { AssignmentModule } from './modules/assignment/assignment.module';
import { AuthModule } from './modules/auth/auth.module';
import { BlockSectionModule } from './modules/block-section/block-section.module';
import { CourseModule } from './modules/course/course.module';
import { EnrollmentModule } from './modules/enrollment/enrollment.module';
import { FinanceModule } from './modules/finance/finance.module';
import { InstructorModule } from './modules/user/roles/instructor/instructor.module';
import { NotificationModule } from './modules/notification/notification.module';
import { ProgramModule } from './modules/program/program.module';
import { ScheduleModule } from './modules/schedule/schedule.module';
import { UserModule } from './modules/user/user.module';

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
      EnrollmentModule,
      BlockSectionModule,
      ProgramModule,
      InstructorModule,
   ],
   controllers: [AppController],
   providers: [AppService],
   exports: [JwtModule],
})
export class AppModule {}
