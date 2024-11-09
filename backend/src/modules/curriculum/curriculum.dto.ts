import {
   IsArray,
   IsMongoId,
   IsNotEmpty,
   IsNumber,
   IsOptional,
   IsString,
} from 'class-validator';

export class CreateCurriculumDto {
   @IsString()
   programId: string;

   @IsNotEmpty()
   @IsNumber()
   yearLevel: number;

   @IsNotEmpty()
   @IsArray()
   @IsMongoId({ each: true })
   courses: string[];

   @IsOptional()
   @IsArray()
   @IsMongoId({ each: true })
   electiveCourses?: string[];

   @IsString()
   @IsNotEmpty()
   semester: string;
}
