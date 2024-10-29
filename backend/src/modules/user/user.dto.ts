import {
   IsNotEmpty,
   IsEmail,
   IsString,
   IsOptional,
   IsEnum,
} from 'class-validator';

export class CreateUserDto {
   @IsOptional()
   userId?: string;

   @IsNotEmpty()
   @IsString()
   firstName: string;

   @IsNotEmpty()
   @IsString()
   lastName: string;

   @IsOptional()
   @IsString()
   userPhoto?: string;

   @IsNotEmpty()
   @IsEmail()
   email: string;

   @IsNotEmpty()
   @IsString()
   phoneNum: string;

   @IsNotEmpty()
   birthDate: Date;

   @IsNotEmpty()
   @IsEnum(['Male', 'Female', 'Other'])
   gender: string;

   @IsNotEmpty()
   @IsString()
   username: string;

   @IsNotEmpty()
   @IsString()
   password: string;

   @IsOptional()
   @IsString()
   role?: string;
}
