import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { StudentService } from './student.service';

@Injectable()
export class StudentIdGenerator {
  constructor(
    @Inject(forwardRef(() => StudentService))
    private readonly studentService: StudentService,
  ) {}

  async generateID(): Promise<string> {
    const min = 100000;
    const max = 999999;
    let studentID: string;
    let isUnique = false;

    while (!isUnique) {
      studentID = Math.floor(Math.random() * (max - min + 1) + min).toString();

      const studentExists =
        await this.studentService.findByStudentId(studentID);
      if (!studentExists) {
        isUnique = true;
      }
    }

    return studentID;
  }
}
