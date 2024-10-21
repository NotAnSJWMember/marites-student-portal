import { IsNotEmpty, IsString, IsNumber, IsBoolean } from 'class-validator';
import { Types } from 'mongoose';

export class CreateEnrollmentDto {
   @IsNotEmpty()
   enrollmentId: Types.ObjectId;

   @IsNotEmpty()
   @IsString()
   scheduleId: string;

   @IsNotEmpty()
   @IsString()
   programId: string;

   @IsNotEmpty()
   @IsString()
   userId: string;

   @IsNotEmpty()
   @IsString()
   major: string;

   @IsNotEmpty()
   @IsNumber()
   yearLevel: number;

   @IsNotEmpty()
   @IsNumber()
   midterm: number;

   @IsNotEmpty()
   @IsNumber()
   final: number;

   @IsNotEmpty()
   @IsString()
   remarks: string;

   @IsNotEmpty()
   @IsBoolean()
   dropped: boolean;

   @IsNotEmpty()
   dateEnrolled: Date;
}
