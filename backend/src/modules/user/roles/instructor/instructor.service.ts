import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Instructor } from './instructor.schema';
import { Model } from 'mongoose';
import { CreateInstructorDto } from './instructor.dto';
import { UserService } from '../../user.service';
import { User } from '../../user.schema';

@Injectable()
export class InstructorService {
   private readonly logger = new Logger(InstructorService.name);

   constructor(
      @InjectModel(Instructor.name) private InstructorModel: Model<Instructor>,
      @InjectModel(User.name) private userModel: Model<User>,
      private readonly userService: UserService,
   ) {}

   async create(createInstructorDto: CreateInstructorDto): Promise<void> {
      this.logger.log('Creating new instructor...');

      const instructor = await this.userService.create(createInstructorDto);

      const newInstructor = new this.InstructorModel({
         ...createInstructorDto,
         userId: instructor.userId,
      });

      await newInstructor.save();

      await this.userModel.updateOne(
         { userId: instructor.userId },
         { $set: { role: 'instructor' } },
      );

      this.logger.log('Instructor created successfully!');
   }

   async findAll(): Promise<Instructor[]> {
      return this.InstructorModel.find().exec();
   }

   async findOne(id: string): Promise<Instructor> {
      return this.InstructorModel.findById(id).exec();
   }

   async update(
      id: string,
      userData: Partial<CreateInstructorDto>,
   ): Promise<Instructor> {
      return this.InstructorModel.findByIdAndUpdate(id, userData, {
         new: true,
      }).exec();
   }

   async delete(userId: string): Promise<void> {
      await this.userService.delete(userId);
   }

   async createDummyData(): Promise<void> {
      const dummyInstructors = [
         {
            userId: '',
            birthDate: new Date('2004-08-15'),
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phoneNum: '12345678910',
            gender: 'Male',
            username: 'johndoe',
            password: 'depota',
            department: 'Computer Science',
         },
         {
            userId: '',
            birthDate: new Date('2004-08-16'),
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane.smith@example.com',
            phoneNum: '12345678910',
            gender: 'Female',
            username: 'janesmith',
            password: 'depota',
            department: 'Mathematics',
         },
         {
            userId: '',
            birthDate: new Date('2004-08-17'),
            firstName: 'Mark',
            lastName: 'Johnson',
            email: 'mark.johnson@example.com',
            phoneNum: '12345678910',
            gender: 'Male',
            username: 'markjhonson',
            password: 'depota',
            department: 'Physics',
         },
      ];

      for (const instructor of dummyInstructors) {
         await this.create(instructor);
      }

      this.logger.log('Dummy instructors created successfully.');
   }
}
