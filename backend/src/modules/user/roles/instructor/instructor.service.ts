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
         password: instructor.password,
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
            userId: '000001',
            birthDate: new Date('2004-11-01'),
            firstName: 'Caenar',
            lastName: 'Arteta',
            email: 'crazy@apple.com',
            phoneNum: '12345678910',
            gender: 'Male',
            username: 'whoami',
            password: '1',
            department: 'Computer Science',
         },
      ];

      for (const instructor of dummyInstructors) {
         await this.create(instructor);
      }

      this.logger.log(
         'And Caenar said, "Let there be one ultimate instructor in this portal.',
      );
   }
}
