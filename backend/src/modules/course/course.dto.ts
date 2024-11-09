import { IsNotEmpty, IsString, IsNumber, IsPositive } from 'class-validator';

export class CreateCourseDto {
   @IsNotEmpty()
   @IsString()
   code: string;

   @IsNotEmpty()
   @IsString()
   description: string;

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
