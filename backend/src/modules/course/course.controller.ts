import {
   Controller,
   Post,
   Get,
   Param,
   Body,
   Put,
   Delete,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './course.dto';
import { Course } from './course.schema';
import { Types } from 'mongoose';

@Controller('course')
export class CourseController {
   constructor(private readonly courseService: CourseService) {}

   @Post()
   async create(@Body() createCourseDto: CreateCourseDto): Promise<Course> {
      return this.courseService.create(createCourseDto);
   }

   @Get()
   async findAll(): Promise<Course[]> {
      return this.courseService.findAll();
   }

   @Get(':id')
   async findOne(@Param('id') id: Types.ObjectId): Promise<Course> {
      return this.courseService.findOne(id);
   }

   @Put(':id')
   async update(
      @Param('id') id: Types.ObjectId,
      @Body() userData: Partial<CreateCourseDto>,
   ): Promise<Course> {
      return this.courseService.update(id, userData);
   }

   @Delete(':id')
   async delete(@Param('id') id: Types.ObjectId): Promise<Course> {
      return this.courseService.delete(id);
   }

   @Post('seed')
   async seed(): Promise<string> {
      await this.courseService.createDummyData();
      return 'Dummy courses created successfully!';
   }
}
