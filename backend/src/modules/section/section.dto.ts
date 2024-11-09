import {
   IsNotEmpty,
   IsString,
   IsBoolean,
   IsOptional,
   IsEnum,
} from 'class-validator';

export class CreateSectionDto {
   @IsString()
   courseId: string;

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

   @IsNotEmpty()
   @IsString()
   description: string;

   @IsOptional()
   availableSlots?: number;

   @IsBoolean()
   isActive?: boolean;
}
