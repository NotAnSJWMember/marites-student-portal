import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Student } from './student.schema';
import { UserService } from '../../user.service';
import { CreateStudentDto } from './student.dto';
import { CurriculumService } from 'src/modules/curriculum/curriculum.service';
import { User } from '../../user.schema';

@Injectable()
export class StudentService {
   protected logger = new Logger(StudentService.name);

   constructor(
      @InjectModel(Student.name) private studentModel: Model<Student>,
      @InjectModel(User.name) private userModel: Model<User>,
      private userService: UserService,
      private curriculumService: CurriculumService,
   ) {}

   async create(createStudentDto: CreateStudentDto): Promise<void> {
      this.logger.log('Creating new student...');

      const curriculum = await this.curriculumService.findCurriculum(
         createStudentDto.programId,
         createStudentDto.yearLevel,
      );

      if (!curriculum) {
         this.logger.warn(
            'Curriculum not found for this program and year level',
         );
      } else {
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
      }
   }

   async findAll(): Promise<Student[]> {
      this.logger.log('Fetching all users...');
      const users = await this.studentModel.find().exec();
      this.logger.log(`Fetched ${users.length} users.`);
      return users;
   }

   async findOne(userId: string): Promise<Student> {
      this.logger.log(`Fetching user with Object ID: ${userId}`);
      const user = await this.studentModel.findOne({ userId }).exec();
      if (user) {
         this.logger.log(`Found user: ${user}`);
      } else {
         this.logger.warn(`User with Object ID: ${userId} not found.`);
      }
      return user;
   }

   async findByUserId(userId: string): Promise<Student | null> {
      return this.studentModel.findOne({ userId }).exec();
   }

   async findByUsername(username: string): Promise<Student | null> {
      return this.studentModel.findOne({ username }).exec();
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
}
