import {
   Body,
   Controller,
   Delete,
   Get,
   HttpException,
   HttpStatus,
   Param,
   Post,
   Put,
} from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { Enrollment } from './enrollment.schema';
import { Types } from 'mongoose';
import { CreateEnrollmentDto } from './enrollment.dto';

@Controller('enrollment')
export class EnrollmentController {
   constructor(private readonly enrollmentService: EnrollmentService) {}

   @Post('batch-enroll')
   async batchEnroll(
      @Body()
      body: {
         courseIds: Types.ObjectId[];
         sectionIds: Types.ObjectId[];
         courseTypes: string[];
         studentId: string;
         schoolYear: string;
         semester: number;
         tuitionFee: {
            amount: number;
            totalDue: number;
            discounts: { amount: number }[];
         };
      },
   ) {
      return this.enrollmentService.batchEnroll(
         body.courseIds,
         body.sectionIds,
         body.courseTypes,
         body.studentId,
         body.schoolYear,
         body.semester,
         body.tuitionFee,
      );
   }

   @Put('update-grades')
   async updateGrades(
      @Body()
      body: {
         enrollments: {
            _id: Types.ObjectId;
            grades: {
               prelim: number;
               midterm: number;
               prefinal: number;
               final: number;
            };
         }[];
      },
   ): Promise<{ status: string; message: string; data: Enrollment[] }> {
      try {
         const updatedEnrollments =
            await this.enrollmentService.updateGradesForEnrollments(
               body.enrollments,
            );

         return {
            status: 'success',
            message: 'Grades updated successfully.',
            data: updatedEnrollments,
         };
      } catch (error) {
         throw new HttpException(
            `Failed to update grades: ${error.message}`,
            HttpStatus.BAD_REQUEST,
         );
      }
   }

   @Get()
   async findAll(): Promise<Enrollment[]> {
      return this.enrollmentService.findAll();
   }

   @Get(':id')
   async findOne(@Param('id') id: Types.ObjectId): Promise<Enrollment> {
      return this.enrollmentService.findOne(id);
   }

   @Put(':id')
   async update(
      @Param('id') id: Types.ObjectId,
      @Body() newData: Partial<CreateEnrollmentDto>,
   ): Promise<Enrollment> {
      return this.enrollmentService.update(id, newData);
   }

   @Delete(':id')
   async delete(@Param('id') id: Types.ObjectId): Promise<Enrollment> {
      return this.enrollmentService.delete(id);
   }
}
