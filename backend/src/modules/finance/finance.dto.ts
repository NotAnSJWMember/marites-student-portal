import {
   IsNotEmpty,
   IsString,
   IsNumber,
   IsOptional,
   IsArray,
   ValidateNested,
   IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';

class DiscountDto {
   @IsString()
   @IsNotEmpty()
   type: string;

   @IsNumber()
   @IsNotEmpty()
   amount: number;
}

class TuitionFeeDto {
   @IsNumber()
   @IsNotEmpty()
   amount: number;

   @IsArray()
   @IsOptional()
   @ValidateNested({ each: true })
   @Type(() => DiscountDto)
   discounts?: DiscountDto[];

   @IsNumber()
   @IsOptional()
   totalDue?: number;
}

class TransactionDto {
   @IsDate()
   @IsNotEmpty()
   date: Date;

   @IsString()
   @IsNotEmpty()
   method: string;

   @IsNumber()
   @IsNotEmpty()
   amount: number;

   @IsNumber()
   @IsNotEmpty()
   balance: number;

   @IsString()
   @IsOptional()
   referenceNo?: string;
}

class PaymentStatusDto {
   @IsString()
   @IsNotEmpty()
   status: string;

   @IsDate()
   @IsNotEmpty()
   lastUpdated: Date;
}

export class CreateFinanceDto {
   @IsNotEmpty()
   studentId: string;

   @IsString()
   @IsNotEmpty()
   schoolYear: string;

   @IsNumber()
   @IsNotEmpty()
   semester: number;

   @ValidateNested()
   @Type(() => TuitionFeeDto)
   tuitionFee: TuitionFeeDto;

   @IsArray()
   @ValidateNested({ each: true })
   @Type(() => TransactionDto)
   transactions: TransactionDto[];

   @IsNumber()
   @IsNotEmpty()
   outstandingBalance: number;

   @ValidateNested()
   @Type(() => PaymentStatusDto)
   paymentStatus: PaymentStatusDto;
}
