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

   async createPrograms(): Promise<void> {
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
         {
            description: 'Bachelor of Arts in Communication',
            code: 'BAComm',
            duration: 4,
            department: 'Arts and Humanities',
         },
         {
            description: 'Bachelor of Science in Nursing',
            code: 'BSN',
            duration: 4,
            department: 'Health Sciences',
         },
         {
            description: 'Bachelor of Science in Business Administration',
            code: 'BSBA',
            duration: 4,
            department: 'Business and Management',
         },
         {
            description: 'Bachelor of Science in Tourism Management',
            code: 'BSTour',
            duration: 4,
            department: 'Tourism and Hospitality',
         },
         {
            description: 'Bachelor of Science in Accountancy',
            code: 'BSA',
            duration: 4,
            department: 'Business and Management',
         },
         {
            description:
               'Bachelor of Science in Education Major in Mathematics',
            code: 'BSEMath',
            duration: 4,
            department: 'Education',
         },
         {
            description: 'Bachelor of Science in Psychology',
            code: 'BSPsych',
            duration: 4,
            department: 'Social Sciences',
         },
         {
            description: 'Bachelor of Science in Architecture',
            code: 'BSArch',
            duration: 5,
            department: 'Architecture and Design',
         },
      ];

      const miscellaneousFees = [
         {
            feeType: 'Library Fee',
            amount: 500,
            description:
               'Fee for accessing the library resources and borrowing books',
         },
         {
            feeType: 'Laboratory Fee',
            amount: 3000,
            description:
               'Fee for using the laboratory facilities for hands-on practice',
         },
         {
            feeType: 'Activity Fee',
            amount: 800,
            description: 'Fee for student activities and campus events',
         },
         {
            feeType: 'Technology Fee',
            amount: 500,
            description:
               'Fee for maintaining and upgrading technology on campus',
         },
         {
            feeType: 'Student Health Fee',
            amount: 3000,
            description:
               'Fee for health services and medical assistance on campus',
         },
      ];

      for (const program of programs) {
         const fees = [
            {
               schoolYear: '2024-2025',
               semester: 1,
               tuitionFee: Math.floor(Math.random() * 10000) + 40000, // Random fee between 40k-50k
            },
            {
               schoolYear: '2024-2025',
               semester: 2,
               tuitionFee: Math.floor(Math.random() * 10000) + 40000,
            },
         ];

         await this.programModel.create({
            ...program,
            fees,
            miscellaneousFees,
         });
      }
      console.log('Programs successfully created!');
   }
}
