import {
   IsNotEmpty,
   IsString,
   IsEnum,
   IsBoolean,
   IsOptional,
   IsDate,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateNotificationDto {
   @IsNotEmpty()
   userId: Types.ObjectId;

   @IsNotEmpty()
   @IsString()
   message: string;

   @IsOptional()
   @IsEnum(['Info', 'Warning', 'Alert', 'Reminder'])
   type: string;

   @IsOptional()
   @IsBoolean()
   read: boolean;

   @IsOptional()
   @IsDate()
   sentAt: Date;
}
