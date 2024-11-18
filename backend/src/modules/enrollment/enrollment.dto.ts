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
   @IsString()
   courseId: Types.ObjectId;

   @IsNotEmpty()
   studentId: string;

   @IsNotEmpty()
   @IsEnum(['core', 'elective'])
   type: string;

   @IsOptional()
   @IsNumber()
   prelim: number;

   @IsOptional()
   @IsNumber()
   midterm: number;

   @IsOptional()
   @IsNumber()
   prefinal: number;

   @IsOptional()
   @IsNumber()
   final: number;

   @IsOptional()
   @IsString()
   remarks: string;

   @IsNotEmpty()
   @IsString()
   @IsEnum(['Enrolled', 'Completed', 'NC', 'INC'])
   status: string[];

   @IsOptional()
   @IsBoolean()
   dropped: boolean;
}
