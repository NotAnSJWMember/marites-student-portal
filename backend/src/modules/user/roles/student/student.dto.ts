import {
   IsArray,
   IsBoolean,
   IsDateString,
   IsMongoId,
   IsNumber,
   IsOptional,
   IsString,
} from 'class-validator';
import { CreateUserDto } from '../../user.dto';
import { Types } from 'mongoose';

export class CreateStudentDto extends CreateUserDto {
   @IsString()
   programId: string;

   @IsString()
   @IsOptional()
   curriculumId?: string;

   @IsNumber()
   yearLevel: number;

   @IsNumber()
   @IsOptional()
   currentSemester?: number;

   @IsBoolean()
   @IsOptional()
   enrollmentStatus?: boolean;

   @IsDateString()
   @IsOptional()
   enrollmentDate?: Date;

   @IsOptional()
   @IsArray()
   @IsMongoId({ each: true })
   financeRecords?: Types.ObjectId[];
}
