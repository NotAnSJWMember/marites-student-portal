import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProgramDto {
   @IsNotEmpty()
   @IsString()
   description: string;

   @IsNotEmpty()
   @IsString()
   code: string;

   @IsNotEmpty()
   @IsNumber()
   duration: number;

   @IsNotEmpty()
   @IsString()
   department: string;
}
