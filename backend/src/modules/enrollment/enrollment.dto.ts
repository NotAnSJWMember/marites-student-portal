import {
   IsNotEmpty,
   IsString,
   IsNumber,
   IsBoolean,
   IsEnum,
   IsOptional,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateEnrollmentDto {
   @IsNotEmpty()
   @IsString()
   courseId: Types.ObjectId;

   @IsNotEmpty()
   @IsString()
   studentId: string;

   @IsNotEmpty()
   @IsEnum(['core', 'elective'])
   type: string;

   @IsNotEmpty()
   @IsString()
   schoolYear: string;

   @IsNotEmpty()
   @IsNumber()
   semester: number;

   @IsOptional()
   @IsNumber()
   prelim?: number;

   @IsOptional()
   @IsNumber()
   midterm?: number;

   @IsOptional()
   @IsNumber()
   prefinal?: number;

   @IsOptional()
   @IsNumber()
   final?: number;

   @IsOptional()
   @IsString()
   remarks?: string;

   @IsNotEmpty()
   @IsEnum(['Enrolled', 'Completed', 'NC', 'INC'])
   status: string;

   @IsOptional()
   @IsBoolean()
   dropped?: boolean;
}
