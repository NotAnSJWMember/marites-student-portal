import { IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateProgramDto {
   @IsNotEmpty()
   programId: Types.ObjectId;

   @IsNotEmpty()
   @IsString()
   programDescription: string;

   @IsNotEmpty()
   @IsString()
   collegeCode: string;
}
