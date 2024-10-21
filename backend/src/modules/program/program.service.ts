import { Injectable } from '@nestjs/common';
import { Program } from './program.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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

   async findOne(id: string): Promise<Program> {
      return this.ProgramModel.findById(id).exec();
   }

   async update(id: string): Promise<Program> {
      return this.ProgramModel.findByIdAndUpdate(id, { new: true }).exec();
   }

   async remove(id: string): Promise<Program> {
      return this.ProgramModel.findByIdAndDelete(id).exec();
   }
}
