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
   async findOne(@Param('id') id: string): Promise<Course> {
      return this.courseService.findOne(id);
   }

   @Put(':id')
   async update(
      @Param('id') id: string,
      @Body() userData: Partial<CreateCourseDto>,
   ): Promise<Course> {
      return this.courseService.update(id, userData);
   }

   @Delete(':id')
   async delete(@Param('id') id: string): Promise<Course> {
      return this.courseService.delete(id);
   }

   @Post('seed')
   async seed(): Promise<string> {
      await this.courseService.createDummyData();
      return 'Dummy courses created successfully!';
   }

   @Post('test/:userId')
   async test(@Param('userId') id: string): Promise<void> {
      return this.courseService.testData(id);
   }
}
