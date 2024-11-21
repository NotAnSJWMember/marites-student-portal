import {
   IsNotEmpty,
   IsNumber,
   IsString,
   IsArray,
   ValidateNested,
   IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

class FeeDto {
   @IsNotEmpty()
   @IsString()
   schoolYear: string;

   @IsNotEmpty()
   @IsNumber()
   semester: number;

   @IsNotEmpty()
   @IsNumber()
   tuitionFee: number;
}

class MiscellaneousFeeDto {
   @IsNotEmpty()
   @IsString()
   feeType: string;

   @IsString()
   description?: string;

   @IsNotEmpty()
   @IsNumber()
   amount: number;
}

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

   @IsNotEmpty()
   @IsArray()
   @ValidateNested({ each: true })
   @Type(() => FeeDto)
   fees: FeeDto[];

   @IsOptional()
   @IsArray()
   @ValidateNested({ each: true })
   @Type(() => MiscellaneousFeeDto)
   miscellaneousFees: MiscellaneousFeeDto[];
}
