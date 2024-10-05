import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Student, StudentDocument } from './student.schema';
import { StudentIdGenerator } from './student-id-generate.helper';
import * as bcrypt from 'bcrypt';

@Injectable()
export class StudentService {
  private readonly logger = new Logger(StudentService.name);

  constructor(
    @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
    private readonly studentIdGenerator: StudentIdGenerator,
  ) {}

  async create(studentData: Partial<Student>): Promise<Student> {
    this.logger.log('Creating a new student...');

    try {
      studentData.studentID = await this.studentIdGenerator.generateID();
      this.logger.log(`Generated student ID: ${studentData.studentID}`);

      const hashedPassword = await this.hashPassword(studentData.password);
      this.logger.log('Password hashed successfully.');

      const newStudent = new this.studentModel({
        ...studentData,
        password: hashedPassword,
      });

      await newStudent.save();
      this.logger.log('Student created successfully:', newStudent);
      return newStudent;
    } catch (err) {
      this.logger.error('Failed to create student:', err);
      throw err;
    }
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    this.logger.log('Hashing password...');
    return bcrypt.hash(password, saltRounds);
  }

  async findAll(): Promise<Student[]> {
    this.logger.log('Fetching all students...');
    const students = await this.studentModel.find().exec();
    this.logger.log(`Fetched ${students.length} students.`);
    return students;
  }

  async findOne(id: string): Promise<Student> {
    this.logger.log(`Fetching student with ID: ${id}`);
    const student = await this.studentModel.findById(id).exec();
    if (student) {
      this.logger.log(`Found student: ${student}`);
    } else {
      this.logger.warn(`Student with ID: ${id} not found.`);
    }
    return student;
  }

  async findByStudentId(studentID: string): Promise<Student> {
    this.logger.log(`Searching for student with student ID: ${studentID}`);
    const student = await this.studentModel.findOne({ studentID }).exec();
    if (student) {
      this.logger.log(`Found student: ${student}`);
    } else {
      this.logger.warn(`No student found with student ID: ${studentID}`);
    }
    return student;
  }

  async update(id: string, studentData: Partial<Student>): Promise<Student> {
    this.logger.log(`Updating student with ID: ${id}`);
    const updatedStudent = await this.studentModel
      .findByIdAndUpdate(id, studentData, { new: true })
      .exec();

    if (updatedStudent) {
      this.logger.log(`Successfully updated student: ${updatedStudent}`);
    } else {
      this.logger.warn(`Student with ID: ${id} not found for update.`);
    }

    return updatedStudent;
  }

  async delete(id: string): Promise<Student> {
    this.logger.log(`Deleting student with ID: ${id}`);
    const deletedStudent = await this.studentModel.findByIdAndDelete(id).exec();

    if (deletedStudent) {
      this.logger.log(`Successfully deleted student: ${deletedStudent}`);
    } else {
      this.logger.warn(`No student found with ID: ${id} to delete.`);
    }

    return deletedStudent;
  }
}
