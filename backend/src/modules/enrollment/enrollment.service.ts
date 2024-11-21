import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model, Types } from 'mongoose';
import { Enrollment, Status } from './enrollment.schema';
import { CreateEnrollmentDto } from './enrollment.dto';
import { Course } from '../course/course.schema';
import { Section } from '../section/section.schema';
import { Schedule } from '../schedule/schedule.schema';
import { Student } from '../user/roles/student/student.schema';

@Injectable()
export class EnrollmentService {
   private readonly logger = new Logger(EnrollmentService.name);

   constructor(
      @InjectConnection() private readonly connection: Connection,
      @InjectModel(Enrollment.name) private enrollmentModel: Model<Enrollment>,
      @InjectModel(Course.name) private courseModel: Model<Course>,
      @InjectModel(Section.name) private sectionModel: Model<Section>,
      @InjectModel(Schedule.name) private scheduleModel: Model<Schedule>,
      @InjectModel(Student.name) private studentModel: Model<Student>,
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
      });

      await enrollment.save();

      const section = await this.sectionModel.findOne({
         courseId,
      });

      if (!section) {
         throw new Error('Section not found');
      }

      const schedule = new this.scheduleModel({
         courseId,
         sectionId: section._id,
         studentId,
         instructor: section.instructorId,
         startTime: section.startTime,
         endTime: section.endTime,
         roomCode: section.roomCode,
         days: section.days,
         description: section.description,
      });

      await schedule.save();

      return enrollment;
   }

   async batchEnroll(
      courseIds: Types.ObjectId[],
      sectionIds: Types.ObjectId[],
      courseTypes: string[],
      studentId: string,
      semester: number,
   ): Promise<Enrollment[]> {
      if (
         courseIds.length !== sectionIds.length ||
         courseIds.length !== courseTypes.length
      ) {
         throw new Error(
            'Mismatch between courseIds, sectionIds, and courseTypes.',
         );
      }

      const enrollments: Enrollment[] = [];
      const errors: string[] = [];

      const session = await this.connection.startSession();
      session.startTransaction();

      try {
         for (let i = 0; i < courseIds.length; i++) {
            const courseId = courseIds[i];
            const sectionId = sectionIds[i];
            const courseType = courseTypes[i];

            const section = await this.sectionModel
               .findById(sectionId)
               .session(session);
            if (!section) {
               errors.push(`Section not found for course ${courseId}`);
               continue;
            }

            // Create schedule
            const schedule = new this.scheduleModel({
               courseId,
               sectionId,
               studentId,
               instructorId: section.instructorId,
               startTime: section.startTime,
               endTime: section.endTime,
               roomCode: section.roomCode,
               days: section.days,
               description: section.description,
            });

            const savedSchedule = await schedule.save({ session });

            // Create enrollment
            const enrollment = new this.enrollmentModel({
               courseId,
               scheduleId: savedSchedule._id,
               studentId,
               semester,
               status: Status.ENROLLED,
               remarks: 'Enrolled in course',
               type: courseType,
            });

            await enrollment.save({ session });

            // Update student status
            await this.studentModel.updateOne(
               { userId: studentId },
               {
                  $set: {
                     enrollmentStatus: true,
                     enrollmentDate: Date.now(),
                  },
               },
               { session },
            );

            enrollments.push(enrollment);
         }

         if (errors.length) {
            console.warn(
               `Errors during batch enrollment: ${errors.join(', ')}`,
            );
         }

         await session.commitTransaction();
      } catch (error) {
         await session.abortTransaction();
         throw new Error(`Batch enrollment failed: ${error.message}`);
      } finally {
         session.endSession();
      }

      return enrollments;
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

   async findEnrollmentsByStudent(studentId: string): Promise<Enrollment[]> {
      return await this.enrollmentModel.find({ studentId }).lean();
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
