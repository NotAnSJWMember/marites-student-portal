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
            programDescription: 'Bachelor of Science in Information Systems',
            collegeCode: 'BSIS',
            duration: 4,
         },
         {
            programId: new Types.ObjectId(),
            programDescription: 'Bachelor of Science in Accountancy',
            collegeCode: 'BSA',
            duration: 5,
         },
         {
            programId: new Types.ObjectId(),
            programDescription:
               'Bachelor of Science in Business Administration',
            collegeCode: 'BSBA',
            duration: 4,
         },
         {
            programId: new Types.ObjectId(),
            programDescription: 'Bachelor of Science in Civil Engineering',
            collegeCode: 'BSCE',
            duration: 5,
         },
         {
            programId: new Types.ObjectId(),
            programDescription: 'Bachelor of Science in Mechanical Engineering',
            collegeCode: 'BSME',
            duration: 5,
         },
         {
            programId: new Types.ObjectId(),
            programDescription: 'Bachelor of Science in Nursing',
            collegeCode: 'BSN',
            duration: 4,
         },
         {
            programId: new Types.ObjectId(),
            programDescription: 'Bachelor of Science in Psychology',
            collegeCode: 'BSPsych',
            duration: 4,
         },
         {
            programId: new Types.ObjectId(),
            programDescription: 'Bachelor of Science in Biology',
            collegeCode: 'BSBio',
            duration: 4,
         },
         {
            programId: new Types.ObjectId(),
            programDescription: 'Bachelor of Science in Architecture',
            collegeCode: 'BSArch',
            duration: 5,
         },
         {
            programId: new Types.ObjectId(),
            programDescription: 'Bachelor of Science in Education',
            collegeCode: 'BSEd',
            duration: 4,
         },
         {
            programId: new Types.ObjectId(),
            programDescription: 'Bachelor of Arts in Communication',
            collegeCode: 'BACOMM',
            duration: 4,
         },
         {
            programId: new Types.ObjectId(),
            programDescription: 'Bachelor of Science in Hospitality Management',
            collegeCode: 'BSHM',
            duration: 4,
         },
         {
            programId: new Types.ObjectId(),
            programDescription: 'Bachelor of Science in Tourism Management',
            collegeCode: 'BSTM',
            duration: 4,
         },
         {
            programId: new Types.ObjectId(),
            programDescription: 'Bachelor of Science in Criminology',
            collegeCode: 'BSCrim',
            duration: 4,
         },
      ];

      await this.ProgramModel.insertMany(programs);
      console.log('Dummy programs created successfully');
   }
}
