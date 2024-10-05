import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { Student } from './student.schema';

@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  async create(@Body() studentData: Partial<Student>): Promise<Student> {
    return this.studentService.create(studentData);
  }

  @Get()
  async findAll(): Promise<Student[]> {
    return this.studentService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Student> {
    return this.studentService.findOne(id);
  }

  @Put('id')
  async update(
    @Param('id') id: string,
    @Body() studentData: Partial<Student>,
  ): Promise<Student> {
    return this.studentService.update(id, studentData);
  }

  @Delete('id')
  async delte(@Param('id') id: string): Promise<Student> {
    return this.studentService.delete(id);
  }
}
