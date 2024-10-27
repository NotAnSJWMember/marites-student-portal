import { Injectable } from '@nestjs/common';
import { Program } from './program.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateProgramDto } from './program.dto';

@Injectable()
export class ProgramService {
   constructor(
      @InjectModel(Program.name) private ProgramModel: Model<Program>,
   ) {}

   async create(createProgramDto: CreateProgramDto): Promise<Program> {
      const newProgram = new this.ProgramModel(createProgramDto);
      return newProgram.save();
   }

   async findAll(): Promise<Program[]> {
      return this.ProgramModel.find().exec();
   }

   async findOne(id: Types.ObjectId): Promise<Program> {
      return this.ProgramModel.findById(id).exec();
   }

   async update(
      id: Types.ObjectId,
      newData: Partial<CreateProgramDto>,
   ): Promise<Program> {
      return this.ProgramModel.findByIdAndUpdate(id, newData, {
         new: true,
      }).exec();
   }

   async delete(id: Types.ObjectId): Promise<Program> {
      return this.ProgramModel.findByIdAndDelete(id).exec();
   }

   async createDummyPrograms(): Promise<void> {
      const programs = [
         {
            programId: new Types.ObjectId(),
            programDescription: 'Bachelor of Science in Information Technology',
            collegeCode: 'BSIT',
         },
         {
            programId: new Types.ObjectId(),
            programDescription: 'Bachelor of Science in Computer Science',
            collegeCode: 'BSCS',
         },
         {
            programId: new Types.ObjectId(),
            programDescription:
               'Bachelor of Science in Electronics Engineering',
            collegeCode: 'BSEE',
         },
      ];

      await this.ProgramModel.insertMany(programs);
      console.log('Dummy programs created successfully');
   }
}
