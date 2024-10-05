import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Student, StudentDocument } from './student.schema';
import { StudentIdGenerator } from './student-id-generate.helper';
import * as bcrypt from 'bcrypt';

@Injectable()
export class StudentService {
  constructor(
    @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
    private readonly studentIdGenerator: StudentIdGenerator,
  ) {}

  async create(studentData: Partial<Student>): Promise<Student> {
    studentData.studentID = await this.studentIdGenerator.generateID();
    const hashedPassword = await this.hashPassword(studentData.password);
    const newStudent = new this.studentModel({
      ...studentData,
      password: hashedPassword,
    });
    return newStudent.save();
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  async findAll(): Promise<Student[]> {
    return this.studentModel.find().exec();
  }

  async findOne(id: string): Promise<Student> {
    return this.studentModel.findById(id).exec();
  }

  async findByStudentId(studentID: string): Promise<Student> {
    return this.studentModel.findOne({ studentID }).exec();
  }

  async update(id: string, studentData: Partial<Student>): Promise<Student> {
    return this.studentModel
      .findByIdAndUpdate(id, studentData, { new: true })
      .exec();
  }

  async delete(id: string): Promise<Student> {
    return this.studentModel.findByIdAndDelete(id).exec();
  }
}
