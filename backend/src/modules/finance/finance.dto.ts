import {
   IsNotEmpty,
   IsString,
   IsNumber,
   IsEnum,
   IsOptional,
   IsDate,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateFinanceDto {
   @IsNotEmpty()
   userId: Types.ObjectId;

   @IsNotEmpty()
   @IsString()
   description: string;

   @IsNotEmpty()
   @IsEnum(['Tuition', 'Miscellaneous', 'Others'])
   category: string;

   @IsNotEmpty()
   @IsNumber()
   amount: number;

   @IsNotEmpty()
   @IsDate()
   dueDate: Date;

   @IsOptional()
   @IsDate()
   paidDate: Date;

   @IsNotEmpty()
   @IsEnum(['Pending', 'Paid', 'Overdue'])
   status: string;
}
