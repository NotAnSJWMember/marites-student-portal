import { IsNotEmpty, IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateSectionDto {
   @IsNotEmpty()
   @IsString()
   description: string;

   @IsOptional()
   availableSlots?: number;

   @IsBoolean()
   isActive?: boolean;
}
