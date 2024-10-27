import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';

@Controller('enrollment')
export class EnrollmentController {
   constructor(private readonly enrollmentService: EnrollmentService) {}

   @Post('/enroll')
   async enroll(@Body('userId') userId: string) {
      try {
         const student = await this.enrollmentService.enrollStudent(userId);
         return { success: true, data: student };
      } catch (error) {
         throw new BadRequestException(error.message);
      }
   }
}
