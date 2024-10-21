import { IsNotEmpty, IsString, IsBoolean } from 'class-validator';
import { Types } from 'mongoose';

export class CreateBlockSectionDto {
   @IsNotEmpty()
   blockId: Types.ObjectId;

   @IsNotEmpty()
   @IsString()
   blockDescription: string;

   @IsBoolean()
   blockActive?: boolean;
}
