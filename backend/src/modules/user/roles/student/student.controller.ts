import {
   Body,
   Controller,
   Delete,
   Get,
   Param,
   Post,
   Put,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './student.dto';
import { Student } from './student.schema';

@Controller('student')
export class StudentController {
   constructor(private readonly studentService: StudentService) {}

   @Post()
   async create(@Body() createStudentDto: CreateStudentDto): Promise<void> {
      return this.studentService.create(createStudentDto);
   }

   @Get()
   async findAll(): Promise<Student[]> {
      return this.studentService.findAll();
   }

   @Get(':id')
   async findOne(@Param('id') id: string): Promise<Student> {
      return this.studentService.findOne(id);
   }
   @Put(':id')
   async update(
      @Param(':id') id: string,
      @Body() userData: Partial<CreateStudentDto>,
   ): Promise<Student> {
      return this.studentService.update(id, userData);
   }

   @Delete(':id')
   async delete(@Param(':id') id: string) {
      return this.studentService.delete(id);
   }
}
