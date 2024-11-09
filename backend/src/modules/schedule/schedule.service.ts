import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateScheduleDto } from './schedule.dto';
import { Schedule } from './schedule.schema';
import { Model, Types } from 'mongoose';
import { Section } from '../section/section.schema';

@Injectable()
export class ScheduleService {
   constructor(
      @InjectModel(Schedule.name) private scheduleModel: Model<Schedule>,
      @InjectModel(Section.name) private sectionModel: Model<Section>,
   ) {}

   async enrollStudentInCourse(
      studentId: string,
      courseId: string,
      sectionId: string,
   ): Promise<void> {
      const section = await this.sectionModel.findById(sectionId);

      if (!section) {
         console.log('Section not found');
         return;
      }

      if (section.availableSlots <= 0) {
         console.log('No available slots in this section');
         return;
      }

      const schedule = new this.scheduleModel({
         courseId: courseId,
         sectionId: sectionId,
      });

      await schedule.save();

      section.availableSlots -= 1;
      await section.save();
   }

   async create(createScheduleDto: CreateScheduleDto): Promise<Schedule> {
      const newSchedule = new this.scheduleModel(createScheduleDto);
      return newSchedule.save();
   }

   async findAll(): Promise<Schedule[]> {
      return this.scheduleModel.find().exec();
   }

   async findOne(id: Types.ObjectId): Promise<Schedule> {
      return this.scheduleModel.findById(id).exec();
   }

   async update(
      id: Types.ObjectId,
      newData: Partial<CreateScheduleDto>,
   ): Promise<Schedule> {
      return this.scheduleModel
         .findByIdAndUpdate(id, newData, {
            new: true,
         })
         .exec();
   }

   async delete(id: Types.ObjectId): Promise<Schedule> {
      return this.scheduleModel.findByIdAndDelete(id).exec();
   }

   async findCourseSchedule(
      courseId: Types.ObjectId,
      sectionId: Types.ObjectId,
   ): Promise<any> {
      return this.scheduleModel.findOne({ courseId, sectionId }).exec();
   }
}
