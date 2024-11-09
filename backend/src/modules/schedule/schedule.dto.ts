import { IsNotEmpty, IsString } from 'class-validator';

export class CreateScheduleDto {
   @IsString()
   courseId: string;

   @IsString()
   sectionId: string;

   @IsNotEmpty()
   studentId: string;
}
