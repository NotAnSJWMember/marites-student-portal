import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Enrollment } from './enrollment.schema';
import { CreateEnrollmentDto } from './enrollment.dto';
import { ProgramService } from '../program/program.service';
import { StudentService } from '../user/roles/student/student.service';
import { Student } from '../user/roles/student/student.schema';
import { Program } from '../program/program.schema';

@Injectable()
export class EnrollmentService {
   private readonly logger = new Logger(EnrollmentService.name);

   constructor(
      @InjectModel(Enrollment.name) private enrollmentModel: Model<Enrollment>,
      private readonly studentService: StudentService,
      private readonly programService: ProgramService,
   ) {}

   async enrollStudent(userId: string) {
      let student = await this.studentService.findByUserId(userId);

      if (!student) {
         student = await this.studentService.findByUsername(userId);
      }

      if (!student) {
         throw new BadRequestException('Student not found');
      }

      const program = await this.programService.findOne(student.programId);
      if (!program) throw new BadRequestException('Program not found');

      return this.updateEnrollmentStatus(student, program);
   }

   async updateEnrollmentStatus(student: Student, program: Program) {
      if (!student.enrollmentStatus) {
         student.enrollmentStatus = true;
         student.enrollmentDate = new Date();
         student.yearLevel = 1; // default, but can be updated

         this.logger.log(
            `Enrolling student ${student.userId} in program ${program.programDescription}`,
         );
      } else {
         student.yearLevel += 1;
      }

      await student.save();
      return student;
   }

   async create(createEnrollmentDto: CreateEnrollmentDto): Promise<Enrollment> {
      const newEnrollment = new this.enrollmentModel(createEnrollmentDto);
      return newEnrollment.save();
   }

   async findAll(): Promise<Enrollment[]> {
      return this.enrollmentModel.find().exec();
   }

   async findOne(id: string): Promise<Enrollment> {
      return this.enrollmentModel.findById(id).exec();
   }

   async update(
      id: string,
      newData: Partial<CreateEnrollmentDto>,
   ): Promise<Enrollment> {
      return this.enrollmentModel
         .findByIdAndUpdate(id, newData, { new: true })
         .exec();
   }

   async delete(id: string): Promise<Enrollment> {
      return this.enrollmentModel.findByIdAndDelete(id).exec();
   }
}
