import {
   IsBoolean,
   IsDateString,
   IsNumber,
   IsOptional,
   IsString,
} from 'class-validator';
import { CreateUserDto } from '../../user.dto';

export class CreateStudentDto extends CreateUserDto {
   @IsString()
   programId: string;

   @IsOptional()
   @IsString()
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
}
