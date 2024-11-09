import {
   IsBoolean,
   IsDateString,
   IsMongoId,
   IsNumber,
   IsOptional,
} from 'class-validator';
import { CreateUserDto } from '../../user.dto';

export class CreateStudentDto extends CreateUserDto {
   @IsMongoId()
   programId: string;

   @IsMongoId()
   curriculumId: string;

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
}
