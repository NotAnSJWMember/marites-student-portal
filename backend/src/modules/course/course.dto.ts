import { IsNotEmpty, IsString, IsNumber, IsPositive } from 'class-validator';
import { Types } from 'mongoose';

export class CreateCourseDto {
   @IsNotEmpty()
   courseId: Types.ObjectId;

   @IsNotEmpty()
   @IsString()
   courseCode: string;

   @IsNotEmpty()
   @IsString()
   courseDescription: string;

   @IsNotEmpty()
   @IsNumber()
   @IsPositive()
   labHour: number;

   @IsNotEmpty()
   @IsNumber()
   @IsPositive()
   lecHour: number;

   @IsNotEmpty()
   @IsNumber()
   @IsPositive()
   totalUnit: number;
}
