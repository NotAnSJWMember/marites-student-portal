import {
   Body,
   Controller,
   Delete,
   Get,
   Param,
   Post,
   Put,
} from '@nestjs/common';
import { InstructorService } from './instructor.service';
import { CreateInstructorDto } from './instructor.dto';
import { Instructor } from './instructor.schema';

@Controller('instructor')
export class InstructorController {
   constructor(private readonly instructorService: InstructorService) {}

   @Post()
   async create(
      @Body() createInstructorDto: CreateInstructorDto,
   ): Promise<void> {
      return this.instructorService.create(createInstructorDto);
   }

   @Get()
   async findAll(): Promise<Instructor[]> {
      return this.instructorService.findAll();
   }

   @Get(':id')
   async findOne(@Param('id') id: string): Promise<Instructor> {
      return this.instructorService.findOne(id);
   }
   @Put(':id')
   async update(
      @Param('id') id: string,
      @Body() userData: Partial<CreateInstructorDto>,
   ): Promise<Instructor> {
      return this.instructorService.update(id, userData);
   }

   @Delete(':id')
   async delete(@Param('id') id: string): Promise<void> {
      console.log(id);

      return this.instructorService.delete(id);
   }

   @Post('seed')
   async seed(): Promise<string> {
      await this.instructorService.createDummyData();
      return 'Success!';
   }
}
