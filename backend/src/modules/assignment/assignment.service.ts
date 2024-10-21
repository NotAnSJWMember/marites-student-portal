import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Assignment } from './assignment.schema';
import { Model } from 'mongoose';
import { CreateAssignmentDto } from './assignment.dto';

@Injectable()
export class AssignmentService {
   constructor(
      @InjectModel(Assignment.name)
      private AssignmentModel: Model<Assignment>,
   ) {}

   async create(createAssignmentDto: CreateAssignmentDto): Promise<Assignment> {
      const newAssignment = new this.AssignmentModel(createAssignmentDto);
      return newAssignment.save();
   }

   async findAll(): Promise<Assignment[]> {
      return this.AssignmentModel.find().exec();
   }

   async findOne(id: string): Promise<Assignment> {
      return this.AssignmentModel.findById(id).exec();
   }

   async update(id: string): Promise<Assignment> {
      return this.AssignmentModel.findByIdAndUpdate(id, { new: true }).exec();
   }

   async delete(id: string): Promise<Assignment> {
      return this.AssignmentModel.findByIdAndDelete(id).exec();
   }
}
