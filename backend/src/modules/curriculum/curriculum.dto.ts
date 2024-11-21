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
   @IsArray()
   @IsMongoId({ each: true })
   coreCourses: string[];

   @IsOptional()
   @IsArray()
   @IsMongoId({ each: true })
   electiveCourses?: string[];

   @IsNotEmpty()
   @IsNumber()
   yearLevel: number;

   @IsNotEmpty()
   @IsNumber()
   semester: number;
}
