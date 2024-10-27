import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { Types } from 'mongoose';
import { CreateUserDto } from '../../user.dto';

export class CreateInstructorDto extends CreateUserDto {
   @IsOptional()
   courses?: Types.ObjectId[];

   @IsNotEmpty()
   @IsEnum([
      'Computer Science',
      'Mathematics',
      'Physics',
      'Chemistry',
      'Biology',
      'Engineering',
      'Business',
   ])
   department: string;
}
