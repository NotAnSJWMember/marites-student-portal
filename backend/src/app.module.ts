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
import { SectionModule } from './modules/section/section.module';
import { CourseModule } from './modules/course/course.module';
import { EnrollmentModule } from './modules/enrollment/enrollment.module';
import { FinanceModule } from './modules/finance/finance.module';
import { InstructorModule } from './modules/user/roles/instructor/instructor.module';
import { NotificationModule } from './modules/notification/notification.module';
import { ProgramModule } from './modules/program/program.module';
import { ScheduleModule } from './modules/schedule/schedule.module';
import { UserModule } from './modules/user/user.module';
import { CurriculumService } from './modules/curriculum/curriculum.service';
import { CurriculumModule } from './modules/curriculum/curriculum.module';

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
      SectionModule,
      ProgramModule,
      InstructorModule,
      CurriculumModule,
   ],
   controllers: [AppController],
   providers: [AppService, CurriculumService],
   exports: [JwtModule],
})
export class AppModule {}
