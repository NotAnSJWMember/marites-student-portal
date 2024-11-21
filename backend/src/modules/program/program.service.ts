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
            description: 'Bachelor of Science in Information Technology',
            code: 'BSIT',
            duration: 4,
            department: 'Computer Studies',
         },
         {
            description: 'Bachelor of Science in Computer Science',
            code: 'BSCS',
            duration: 4,
            department: 'Computer Studies',
         },
      ];

      await this.programModel.insertMany(programs);
   }
}
