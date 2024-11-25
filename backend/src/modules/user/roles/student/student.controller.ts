import {
   Body,
   Controller,
   Delete,
   Get,
   Param,
   Post,
   Put,
   UploadedFile,
   UseInterceptors,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './student.dto';
import { Student } from './student.schema';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('student')
export class StudentController {
   constructor(private readonly studentService: StudentService) {}

   @Post()
   @UseInterceptors(FileInterceptor('file'))
   async create(
      @Body() createStudentDto: any,
      @UploadedFile() file: Express.Multer.File,
   ): Promise<any> {
      const studentData: CreateStudentDto = JSON.parse(
         createStudentDto.userData,
      );

      console.log(studentData);
      console.log(file);

      return this.studentService.create(studentData, file);
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
