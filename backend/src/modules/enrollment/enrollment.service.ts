import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Enrollment } from './enrollment.schema';
import { CreateEnrollmentDto } from './enrollment.dto';

@Injectable()
export class EnrollmentService {
   constructor(
      @InjectModel(Enrollment.name) private enrollmentModel: Model<Enrollment>,
   ) {}

   async create(createEnrollmentDto: CreateEnrollmentDto): Promise<Enrollment> {
      const newEnrollment = new this.enrollmentModel(createEnrollmentDto);
      return newEnrollment.save();
   }

   async findAll(): Promise<Enrollment[]> {
      return this.enrollmentModel.find().exec();
   }

   async findOne(id: string): Promise<Enrollment> {
      return this.enrollmentModel.findById(id).exec();
   }

   async update(id: string): Promise<Enrollment> {
      return this.enrollmentModel.findByIdAndUpdate(id, { new: true }).exec();
   }

   async delete(id: string): Promise<Enrollment> {
      return this.enrollmentModel.findByIdAndDelete(id).exec();
   }
}
