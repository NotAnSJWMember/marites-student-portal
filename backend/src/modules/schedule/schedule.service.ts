import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateScheduleDto } from './schedule.dto';
import { Schedule } from './schedule.schema';
import { Model } from 'mongoose';

@Injectable()
export class ScheduleService {
   constructor(
      @InjectModel(Schedule.name) private ScheduleModel: Model<Schedule>,
   ) {}

   async create(createScheduleDto: CreateScheduleDto): Promise<Schedule> {
      const newSchedule = new this.ScheduleModel(createScheduleDto);
      return newSchedule.save();
   }

   async findAll(): Promise<Schedule[]> {
      return this.ScheduleModel.find().exec();
   }

   async findOne(id: string): Promise<Schedule> {
      return this.ScheduleModel.findById(id).exec();
   }

   async update(id: string): Promise<Schedule> {
      return this.ScheduleModel.findByIdAndUpdate(id, { new: true }).exec();
   }

   async delete(id: string): Promise<Schedule> {
      return this.ScheduleModel.findByIdAndDelete(id).exec();
   }
}
