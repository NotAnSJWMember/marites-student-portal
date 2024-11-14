import {
   IsNotEmpty,
   IsString,
   IsNumber,
   IsBoolean,
   IsEnum,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateEnrollmentDto {
   @IsString()
   courseId: Types.ObjectId;

   @IsNotEmpty()
   studentId: string;

   @IsNotEmpty()
   @IsNumber()
   prelim: number;

   @IsNotEmpty()
   @IsNumber()
   midterm: number;

   @IsNotEmpty()
   @IsNumber()
   prefinal: number;

   @IsNotEmpty()
   @IsNumber()
   final: number;

   @IsNotEmpty()
   @IsString()
   remarks: string;

   @IsNotEmpty()
   @IsString()
   @IsEnum(['Enrolled', 'Completed', 'NC', 'INC'])
   status: string[];

   @IsNotEmpty()
   @IsBoolean()
   dropped: boolean;
}
