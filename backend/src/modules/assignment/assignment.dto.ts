import {
   IsNotEmpty,
   IsString,
   IsOptional,
   IsEnum,
   IsDate,
   IsNumber,
   IsUrl,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateAssignmentDto {
   @IsNotEmpty()
   courseId: Types.ObjectId;

   @IsNotEmpty()
   assignedBy: Types.ObjectId;

   @IsNotEmpty()
   @IsString()
   title: string;

   @IsNotEmpty()
   @IsString()
   description: string;

   @IsOptional()
   @IsDate()
   dueDate?: Date;

   @IsNotEmpty()
   @IsEnum(['Pending', 'Completed', 'Graded', 'Overdue'])
   assignmentStatus: string;

   @IsOptional()
   @IsNumber()
   maxPoints?: number;

   @IsOptional()
   @IsUrl()
   submissionLink?: string;
}
