import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Instructor } from './instructor.schema';
import { Model } from 'mongoose';
import { CreateInstructorDto } from './instructor.dto';

@Injectable()
export class InstructorService {
   constructor(
      @InjectModel(Instructor.name) private InstructorModel: Model<Instructor>,
   ) {}

   async create(createInstructorDto: CreateInstructorDto): Promise<Instructor> {
      const newInstructor = new this.InstructorModel(createInstructorDto);
      return newInstructor.save();
   }

   async findAll(): Promise<Instructor[]> {
      return this.InstructorModel.find().exec();
   }

   async findOne(id: string): Promise<Instructor> {
      return this.InstructorModel.findById(id).exec();
   }

   async update(id: string): Promise<Instructor> {
      return this.InstructorModel.findByIdAndUpdate(id, { new: true }).exec();
   }

   async remove(id: string): Promise<Instructor> {
      return this.InstructorModel.findByIdAndDelete(id).exec();
   }
}
