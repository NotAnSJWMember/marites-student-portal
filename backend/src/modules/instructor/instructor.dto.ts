import { IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateInstructorDto {
   @IsNotEmpty()
   userId: Types.ObjectId;

   @IsNotEmpty()
   @IsString()
   role: string;
}
