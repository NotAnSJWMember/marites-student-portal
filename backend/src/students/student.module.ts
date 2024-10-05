import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { Student, StudentSchema } from './student.schema';
import { StudentIdGenerator } from './student-id-generate.helper';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Student.name, schema: StudentSchema }]),
  ],
  providers: [StudentIdGenerator, StudentService],
  controllers: [StudentController],
})
export class StudentModule {}
