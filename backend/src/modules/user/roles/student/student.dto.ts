import {
   IsArray,
   IsBoolean,
   IsDateString,
   IsEnum,
   IsMongoId,
   IsNumber,
   IsOptional,
   ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Status } from './student.schema';
import { CreateUserDto } from '../../user.dto';
import { Types } from 'mongoose';

class CourseRecordDto {
   @IsMongoId()
   courseId: string;

   @IsEnum(Status)
   status: Status;

   @IsOptional()
   @IsNumber()
   grade?: number;
}

export class CreateStudentDto extends CreateUserDto {
   @IsMongoId()
   programId: string;

   @IsNumber()
   yearLevel: number;

   @IsBoolean()
   @IsOptional()
   enrollmentStatus?: boolean;

   @IsDateString()
   @IsOptional()
   enrollmentDate?: Date;

   @IsNumber()
   @IsOptional()
   currentSemester: number;

   @IsArray()
   @ValidateNested({ each: true })
   @Type(() => CourseRecordDto)
   @IsOptional()
   courseRecords?: CourseRecordDto[];

   @IsArray()
   @IsOptional()
   courses: Types.ObjectId[];
}
