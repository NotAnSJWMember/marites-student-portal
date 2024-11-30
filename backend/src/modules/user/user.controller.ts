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
   Res,
   UploadedFile,
   UseGuards,
   UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { User } from './user.schema';
import { UserService } from './user.service';
import { CreateUserDto } from './user.dto';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { Types } from 'mongoose';

@Controller('user')
export class UserController {
   constructor(private readonly userService: UserService) {}

   @Post()
   @UseInterceptors(FileInterceptor('file'))
   async create(
      @Body() createUserDto: any,
      @UploadedFile() file: Express.Multer.File,
   ): Promise<any> {
      const userData: CreateUserDto = JSON.parse(createUserDto.userData);
      return this.userService.create(userData, file);
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
   @UseInterceptors(FileInterceptor('file'))
   @UseGuards(AuthGuard('jwt'), RolesGuard)
   @Roles('admin')
   async update(
      @Param('userId') userId: string,
      @Body() createUserDto: any,
      @UploadedFile() file: Express.Multer.File,
      @Res() res: Response,
   ) {
      try {
         const userData: CreateUserDto = JSON.parse(createUserDto.userData);
         const result = await this.userService.update(userId, userData, file);

         if (result.updatedUser === null) {
            return res.status(HttpStatus.OK).json({
               message: result.message,
            });
         }

         return res.status(HttpStatus.OK).json({
            message: result.message,
            updatedUser: result.updatedUser,
         });
      } catch (error) {
         return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message: 'An error occurred while updating the user.',
            error: error.message,
         });
      }
   }

   @Delete(':userId')
   @UseGuards(AuthGuard('jwt'), RolesGuard)
   @Roles('admin')
   async delete(@Param('userId') userId: string, @Res() res: Response) {
      try {
         const result = await this.userService.delete(userId);

         if (result.deletedUser) {
            return res.status(HttpStatus.OK).json({
               message: result.message,
               deletedUser: result.deletedUser,
            });
         } else {
            return res.status(HttpStatus.NOT_FOUND).json({
               message: result.message,
            });
         }
      } catch (error) {
         return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message: 'An error occurred while deleting the user.',
            error: error.message,
         });
      }
   }

   @Delete('batch-delete')
   @UseGuards(AuthGuard('jwt'), RolesGuard)
   @Roles('admin')
   async batchDelete(
      @Body() body: { userIds: Types.ObjectId[] },
      @Res() res: Response,
   ) {
      try {
         const result = await this.userService.batchDelete(body.userIds);

         if (result) {
            return res.status(HttpStatus.OK).json({
               message: result.message,
            });
         } else {
            return res.status(HttpStatus.NOT_FOUND).json({
               message: result.message,
            });
         }
      } catch (error) {
         return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message: 'An error occurred while deleting the user.',
            error: error.message,
         });
      }
   }

   @Post('/seed')
   async operationRestore() {
      await this.userService.operationRestoreMyself();
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
