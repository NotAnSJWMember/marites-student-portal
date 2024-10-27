import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';
import { CreateUserDto } from '../../user.dto';

export class CreateAdminDto extends CreateUserDto {
   @IsNotEmpty()
   adminLevel: string;

   @IsOptional()
   @IsBoolean()
   isActive: boolean;
}
