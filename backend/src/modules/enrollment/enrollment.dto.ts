import {
   IsNotEmpty,
   IsString,
   IsNumber,
   IsBoolean,
   IsMongoId,
   IsEnum,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateEnrollmentDto {
   @IsMongoId()
   programId: Types.ObjectId;

   @IsMongoId()
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
