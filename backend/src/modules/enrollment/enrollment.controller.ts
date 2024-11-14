import {
   BadRequestException,
   Body,
   Controller,
   Delete,
   Get,
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

   @Post('/enroll')
   async enroll(@Body() courseId: Types.ObjectId, studentId: string) {
      try {
         const student = await this.enrollmentService.enroll(
            courseId,
            studentId,
         );
         return { success: true, data: student };
      } catch (error) {
         throw new BadRequestException(error.message);
      }
   }

   @Post('/batch-enroll')
   async batchEnroll(
      @Body() body: { courseIds: Types.ObjectId[]; studentId: string },
   ) {
      console.log(body.courseIds);
      console.log(body.studentId);
      return this.enrollmentService.batchEnroll(body.courseIds, body.studentId);
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
