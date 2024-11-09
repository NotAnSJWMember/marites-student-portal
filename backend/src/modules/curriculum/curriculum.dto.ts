import {
   IsArray,
   IsMongoId,
   IsNotEmpty,
   IsNumber,
   IsOptional,
} from 'class-validator';

export class CreateCurriculumDto {
   @IsMongoId()
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

   @IsNumber()
   @IsNotEmpty()
   semester: number;
}
