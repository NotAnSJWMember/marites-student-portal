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

   async createMiscFees(): Promise<void> {
      const miscellaneousFees = [
         {
            feeType: 'Library Fee',
            amount: 500,
            description:
               'Fee for accessing the library resources and borrowing books',
            _id: new Types.ObjectId(),
         },
         {
            feeType: 'Laboratory Fee',
            amount: 1500,
            description:
               'Fee for using the laboratory facilities for hands-on practice',
            _id: new Types.ObjectId(),
         },
         {
            feeType: 'Activity Fee',
            amount: 800,
            description: 'Fee for student activities and campus events',
            _id: new Types.ObjectId(),
         },
         {
            feeType: 'Technology Fee',
            amount: 1000,
            description:
               'Fee for maintaining and upgrading technology on campus',
            _id: new Types.ObjectId(),
         },
         {
            feeType: 'Student Health Fee',
            amount: 300,
            description:
               'Fee for health services and medical assistance on campus',
            _id: new Types.ObjectId(),
         },
      ];

      const id = '672ee7ad7c40b8f5027d6741';
      await this.programModel.updateOne(
         { _id: id },
         { $set: { miscellaneousFees: miscellaneousFees } },
      );
   }
}
