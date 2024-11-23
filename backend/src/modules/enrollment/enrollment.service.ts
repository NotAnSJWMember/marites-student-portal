import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model, Types } from 'mongoose';
import { Enrollment, Status } from './enrollment.schema';
import { CreateEnrollmentDto } from './enrollment.dto';
import { Course } from '../course/course.schema';
import { Section } from '../section/section.schema';
import { Schedule } from '../schedule/schedule.schema';
import { Student } from '../user/roles/student/student.schema';
import { Finance } from '../finance/finance.schema';
import { Program } from '../program/program.schema';

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
      @InjectModel(Finance.name) private financeModel: Model<Finance>,
      @InjectModel(Program.name) private programModel: Model<Program>,
   ) {}

   async batchEnroll(
      courseIds: Types.ObjectId[],
      sectionIds: Types.ObjectId[],
      courseTypes: string[],
      studentId: string,
      schoolYear: string,
      semester: number,
      tuitionFee: {
         amount: number;
         totalDue: number;
         discounts: { amount: number }[];
      },
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

      const totalDue = this.calculateTotalDue(
         tuitionFee.amount,
         tuitionFee.discounts,
      );

      try {
         const finance = new this.financeModel({
            studentId,
            tuitionFee: {
               amount: tuitionFee.amount,
               discounts: tuitionFee.discounts,
               totalDue: totalDue,
            },
            outstandingBalance: totalDue,
            paymentStatus: {
               status: 'unpaid',
               lastUpdated: new Date(),
            },
            schoolYear,
            semester,
         });

         const savedFinance = await finance.save({ session });

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

            const existingEnrollment = await this.enrollmentModel
               .findOne({
                  courseId,
                  studentId,
                  schoolYear,
                  semester,
               })
               .session(session);

            if (existingEnrollment) {
               errors.push(`Already enrolled in course ${courseId}`);
               continue;
            }

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

            const enrollment = new this.enrollmentModel({
               courseId,
               scheduleId: savedSchedule._id,
               studentId,
               schoolYear,
               semester,
               status: Status.ENROLLED,
               remarks: 'Enrolled in course',
               type: courseType,
            });

            await enrollment.save({ session });

            await this.studentModel.updateOne(
               { userId: studentId },
               {
                  $set: {
                     enrollmentStatus: true,
                     enrollmentDate: Date.now(),
                     financeRecords: [savedFinance._id],
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

   private calculateOutstandingBalance(tuitionFee: {
      totalDue: number;
      discounts: { amount: number }[];
   }): number {
      let outstandingBalance = tuitionFee.totalDue;

      if (tuitionFee.discounts && tuitionFee.discounts.length > 0) {
         const totalDiscount = tuitionFee.discounts.reduce(
            (sum, discount) => sum + discount.amount,
            0,
         );
         outstandingBalance = tuitionFee.totalDue - totalDiscount;
      }
      return outstandingBalance;
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

   private calculateTotalDue(
      amount: number,
      discounts: { amount: number }[],
   ): number {
      const totalDiscount = discounts.reduce(
         (sum, discount) => sum + discount.amount,
         0,
      );
      return amount - totalDiscount;
   }
}
