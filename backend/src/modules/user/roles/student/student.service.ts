import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Student } from './student.schema';
import { UserService } from '../../user.service';
import { CreateStudentDto } from './student.dto';
import { CurriculumService } from 'src/modules/curriculum/curriculum.service';

@Injectable()
export class StudentService {
   protected logger = new Logger(StudentService.name);

   constructor(
      @InjectModel(Student.name) private studentModel: Model<Student>,
      private userService: UserService,
      private curriculumService: CurriculumService,
   ) {}

   async create(createStudentDto: CreateStudentDto): Promise<any> {
      this.logger.log('Creating new student...');
      try {
         this.logger.log('Creating new student...');

         const curriculum = await this.curriculumService.findCurriculum(
            createStudentDto.programId,
            createStudentDto.yearLevel,
         );

         if (!curriculum) {
            throw new HttpException(
               'Curriculum not found for this program and year level',
               HttpStatus.BAD_REQUEST,
            );
         }

         const student = await this.userService.create(createStudentDto);

         const newStudent = new this.studentModel({
            ...createStudentDto,
            userId: student.userId,
            curriculumId: curriculum._id,
            password: student.password,
            role: 'student',
         });

         await newStudent.save();
         this.logger.log('Student created successfully!');

         return {
            message: 'Student created successfully!',
            student: newStudent,
         };
      } catch (error) {
         throw new HttpException(
            error.message || 'An error occurred during student creation',
            HttpStatus.INTERNAL_SERVER_ERROR,
         );
      }
   }
   async findAll(): Promise<Student[]> {
      this.logger.log('Fetching all users...');

      const students = await this.studentModel.find().exec();
      this.logger.log(`Fetched ${students.length} users.`);

      return students;
   }

   async findOne(userId: string): Promise<Student> {
      this.logger.log(`Fetching user: ${userId}`);

      this.logger.log(`Trying their username...`);
      let student = await this.findByUsername(userId);

      if (!student) {
         this.logger.log('Username not found, trying their ID...');
         student = await this.findByUserId(userId);
      }

      if (student) {
         this.logger.log(`Found user: ${student}`);
      } else {
         this.logger.warn(`User ${userId} not found.`);
      }

      return student;
   }

   async update(
      id: string,
      userData: Partial<CreateStudentDto>,
   ): Promise<Student> {
      return this.studentModel
         .findByIdAndUpdate(id, userData, { new: true })
         .exec();
   }

   async delete(userId: string): Promise<void> {
      await this.userService.delete(userId);
   }

   async findByUserId(userId: string): Promise<Student | null> {
      return this.studentModel.findOne({ userId }).exec();
   }

   async findByUsername(username: string): Promise<Student | null> {
      return this.studentModel.findOne({ username }).exec();
   }
}
