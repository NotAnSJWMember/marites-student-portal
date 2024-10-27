import {
   All,
   Body,
   Controller,
   Delete,
   Get,
   HttpCode,
   HttpException,
   HttpStatus,
   Param,
   Post,
   Put,
   UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { User } from './user.schema';
import { UserService } from './user.service';
import { CreateUserDto } from './user.dto';

@Controller('user')
export class UserController {
   constructor(private readonly userService: UserService) {}

   @Post()
   async create(@Body() createUserDto: CreateUserDto) {
      return this.userService.create(createUserDto);
   }

   @Get()
   @UseGuards(AuthGuard('jwt'), RolesGuard)
   @Roles('admin')
   async findAll(): Promise<User[]> {
      return this.userService.findAll();
   }

   @Get(':userId')
   @UseGuards(AuthGuard('jwt'), RolesGuard)
   @Roles('admin', 'student')
   async findOne(@Param('userId') userId: string): Promise<User> {
      const user = await this.userService.findOne(userId);

      if (!user) {
         throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
      }

      return user;
   }

   @Put(':userId')
   @UseGuards(AuthGuard('jwt'), RolesGuard)
   @Roles('admin')
   async update(
      @Param('userId') userId: string,
      @Body() userData: Partial<User>,
   ): Promise<User> {
      return this.userService.update(userId, userData);
   }

   @Delete(':userId')
   @UseGuards(AuthGuard('jwt'), RolesGuard)
   @Roles('admin')
   async delete(@Param('userId') userId: string): Promise<User> {
      return this.userService.delete(userId);
   }

   @All('*')
   @HttpCode(HttpStatus.METHOD_NOT_ALLOWED)
   handleMethodNotAllowed() {
      throw new HttpException(
         'Method Not Allowed',
         HttpStatus.METHOD_NOT_ALLOWED,
      );
   }
}
