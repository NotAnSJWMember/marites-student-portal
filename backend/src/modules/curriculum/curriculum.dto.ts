import {
   IsArray,
   IsMongoId,
   IsNotEmpty,
   IsNumber,
   IsString,
} from 'class-validator';

export class CreateCurriculumDto {
   @IsNotEmpty()
   @IsMongoId()
   programId: string;

   @IsNotEmpty()
   @IsNumber()
   yearLevel: number;

   @IsNotEmpty()
   @IsArray()
   @IsMongoId({ each: true })
   courses: string[];

   @IsArray()
   @IsMongoId({ each: true })
   electiveCourses?: string[];

   @IsString()
   @IsNotEmpty()
   semester: string;
}
