import { IsNotEmpty, IsEnum, IsString, IsObject } from 'class-validator';

export class CreateScheduleDto {
   @IsNotEmpty()
   @IsObject()
   userId: string;

   @IsNotEmpty()
   @IsObject()
   courseId: string;

   @IsNotEmpty()
   @IsObject()
   programId: string;

   @IsNotEmpty()
   @IsObject()
   sectionId: string;

   @IsNotEmpty()
   @IsString()
   syNo: string;

   @IsNotEmpty()
   @IsString()
   time: string;

   @IsNotEmpty()
   @IsEnum([
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
   ])
   day: string;

   @IsNotEmpty()
   @IsString()
   roomCode: string;
}
