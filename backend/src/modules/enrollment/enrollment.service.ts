import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Enrollment, Status } from './enrollment.schema';
import { CreateEnrollmentDto } from './enrollment.dto';
import { Course } from '../course/course.schema';

@Injectable()
export class EnrollmentService {
   private readonly logger = new Logger(EnrollmentService.name);

   constructor(
      @InjectModel(Enrollment.name) private enrollmentModel: Model<Enrollment>,
      @InjectModel(Course.name) private courseModel: Model<Course>,
   ) {}

   async enroll(
      courseId: Types.ObjectId,
      studentId: string,
   ): Promise<Enrollment> {
      const hasPrerequisites = await this.checkPrerequisites(
         courseId,
         studentId,
      );
      if (!hasPrerequisites) {
         throw new Error(
            'Student has not completed the prerequisites for this course.',
         );
      }

      const enrollment = new this.enrollmentModel({
         courseId,
         studentId,
         status: Status.ENROLLED,
         remarks: 'Enrolled in course',
         dropped: false,
      });

      return enrollment.save();
   }

   async create(createEnrollmentDto: CreateEnrollmentDto): Promise<Enrollment> {
      const newEnrollment = new this.enrollmentModel(createEnrollmentDto);
      return newEnrollment.save();
   }

   async findAll(): Promise<Enrollment[]> {
      return this.enrollmentModel.find().exec();
   }

   async findOne(id: Types.ObjectId): Promise<Enrollment> {
      return this.enrollmentModel.findById(id).exec();
   }

   async update(
      id: Types.ObjectId,
      newData: Partial<CreateEnrollmentDto>,
   ): Promise<Enrollment> {
      return this.enrollmentModel
         .findByIdAndUpdate(id, newData, { new: true })
         .exec();
   }

   async delete(id: Types.ObjectId): Promise<Enrollment> {
      return this.enrollmentModel.findByIdAndDelete(id).exec();
   }

   async checkPrerequisites(
      courseId: Types.ObjectId,
      studentId: string,
   ): Promise<boolean> {
      const course = await this.courseModel
         .findById(courseId)
         .populate('prerequisites')
         .exec();

      if (!course || course.prerequisites.length === 0) return true;

      const completedCourses = await this.getCompletedCourses(studentId);

      for (const prerequisite of course.prerequisites) {
         if (!completedCourses.includes(prerequisite._id)) {
            return false;
         }
      }

      return true;
   }

   async getCompletedCourses(studentId: string): Promise<any[]> {
      const enrollments = await this.enrollmentModel
         .find({
            studentId,
            status: Status.COMPLETED,
         })
         .exec();

      return enrollments.map((enrollment) => enrollment.courseId);
   }
}
