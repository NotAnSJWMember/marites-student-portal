import { Injectable } from '@nestjs/common';
import { Program } from './program.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateProgramDto } from './program.dto';

@Injectable()
export class ProgramService {
   constructor(
      @InjectModel(Program.name) private programModel: Model<Program>,
   ) {}

   async create(createProgramDto: CreateProgramDto): Promise<Program> {
      const newProgram = new this.programModel(createProgramDto);
      return newProgram.save();
   }

   async findAll(): Promise<Program[]> {
      return this.programModel.find().exec();
   }

   async findOne(id: Types.ObjectId): Promise<Program> {
      return this.programModel.findById(id).exec();
   }

   async update(
      id: Types.ObjectId,
      newData: Partial<CreateProgramDto>,
   ): Promise<Program> {
      return this.programModel
         .findByIdAndUpdate(id, newData, {
            new: true,
         })
         .exec();
   }

   async delete(id: Types.ObjectId): Promise<Program> {
      return this.programModel.findByIdAndDelete(id).exec();
   }

   async getCourses(programId: Types.ObjectId): Promise<any> {
      const program = await this.programModel
         .findById(programId)
         .populate('coreCourses electiveCourses')
         .exec();
      return program;
   }

   async createDummyPrograms(): Promise<void> {
      const programs = [
         {
            description: 'Bachelor of Science in Information Systems',
            code: 'BSIS',
            duration: 4,
            department: 'Engineering',
         },
         {
            description: 'Bachelor of Science in Accountancy',
            code: 'BSA',
            duration: 5,
            department: 'Business',
         },
         {
            description: 'Bachelor of Science in Business Administration',
            code: 'BSBA',
            duration: 4,
            department: 'Business',
         },
         {
            description: 'Bachelor of Science in Civil Engineering',
            code: 'BSCE',
            duration: 5,
            department: 'Engineering',
         },
         {
            description: 'Bachelor of Science in Mechanical Engineering',
            code: 'BSME',
            duration: 5,
            department: 'Engineering',
         },
         {
            description: 'Bachelor of Science in Nursing',
            code: 'BSN',
            duration: 4,
            department: 'Health',
         },
         {
            description: 'Bachelor of Science in Psychology',
            code: 'BSPsych',
            duration: 4,
            department: 'Health',
         },
         {
            description: 'Bachelor of Science in Biology',
            code: 'BSBio',
            duration: 4,
            department: 'Science',
         },
         {
            description: 'Bachelor of Science in Architecture',
            code: 'BSArch',
            duration: 5,
            department: 'Engineering',
         },
         {
            description: 'Bachelor of Science in Education',
            code: 'BSEd',
            duration: 4,
            department: 'Education',
         },
         {
            description: 'Bachelor of Arts in Communication',
            code: 'BACOMM',
            duration: 4,
            department: 'Arts',
         },
         {
            description: 'Bachelor of Science in Hospitality Management',
            code: 'BSHM',
            duration: 4,
            department: 'Business',
         },
         {
            description: 'Bachelor of Science in Tourism Management',
            code: 'BSTM',
            duration: 4,
            department: 'Business',
         },
      ];

      await this.programModel.insertMany(programs);
   }
}
