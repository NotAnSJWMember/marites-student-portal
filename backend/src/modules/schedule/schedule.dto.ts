import { IsNotEmpty, IsEnum, IsString, IsMongoId } from 'class-validator';

export class CreateScheduleDto {
   @IsMongoId()
   courseId: string;

   @IsMongoId()
   sectionId: string;

   @IsNotEmpty()
   instructorId: string;

   @IsNotEmpty()
   @IsString()
   startTime: string;

   @IsNotEmpty()
   @IsString()
   endTime: string;

   @IsNotEmpty()
   @IsString()
   @IsEnum([
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
   ])
   days: string[];

   @IsNotEmpty()
   @IsString()
   roomCode: string;
}
