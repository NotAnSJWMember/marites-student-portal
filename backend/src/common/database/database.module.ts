import {
   Assignment,
   AssignmentSchema,
} from 'src/modules/assignment/assignment.schema';
import { Section, SectionSchema } from 'src/modules/section/section.schema';
import { Course, CourseSchema } from 'src/modules/course/course.schema';
import {
   Enrollment,
   EnrollmentSchema,
} from 'src/modules/enrollment/enrollment.schema';
import { Finance, FinanceSchema } from 'src/modules/finance/finance.schema';
import {
   Instructor,
   InstructorSchema,
} from 'src/modules/user/roles/instructor/instructor.schema';
import {
   Notification,
   NotificationSchema,
} from 'src/modules/notification/notification.schema';
import { Program, ProgramSchema } from 'src/modules/program/program.schema';
import { Schedule, ScheduleSchema } from 'src/modules/schedule/schedule.schema';
import { User, UserSchema } from 'src/modules/user/user.schema';
import {
   Student,
   StudentSchema,
} from 'src/modules/user/roles/student/student.schema';

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from 'src/modules/user/roles/admin/admin.schema';
import {
   Curriculum,
   CurriculumSchema,
} from 'src/modules/curriculum/curriculum.schema';

@Module({
   imports: [
      MongooseModule.forRoot(process.env.MONGODB_URI),
      MongooseModule.forFeature([
         { name: User.name, schema: UserSchema },
         { name: Instructor.name, schema: InstructorSchema },
         { name: Student.name, schema: StudentSchema },
         { name: Admin.name, schema: AdminSchema },
         { name: Instructor.name, schema: InstructorSchema },
         { name: Section.name, schema: SectionSchema },
         { name: Course.name, schema: CourseSchema },
         { name: Program.name, schema: ProgramSchema },
         { name: Enrollment.name, schema: EnrollmentSchema },
         { name: Schedule.name, schema: ScheduleSchema },
         { name: Assignment.name, schema: AssignmentSchema },
         { name: Notification.name, schema: NotificationSchema },
         { name: Finance.name, schema: FinanceSchema },
         { name: Curriculum.name, schema: CurriculumSchema },
      ]),
   ],
   exports: [MongooseModule],
})
export class DatabaseModule {}
