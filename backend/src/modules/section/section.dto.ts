import { IsNotEmpty, IsString, IsBoolean } from 'class-validator';
import { Types } from 'mongoose';

export class CreateSectionDto {
   @IsNotEmpty()
   sectionId: Types.ObjectId;

   @IsNotEmpty()
   @IsString()
   sectionDescription: string;

   @IsBoolean()
   sectionActive?: boolean;
}
