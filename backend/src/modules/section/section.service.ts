import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Section } from './section.schema';
import { Model, Types } from 'mongoose';
import { CreateSectionDto } from './section.dto';
import { Instructor } from '../user/roles/instructor/instructor.schema';

@Injectable()
export class SectionService {
   constructor(
      @InjectModel(Section.name)
      private sectionModel: Model<Section>,
      @InjectModel(Instructor.name)
      private instructorModel: Model<Instructor>,
   ) {}

   async create(createSectionDto: CreateSectionDto): Promise<Section> {
      const newSection = new this.sectionModel(createSectionDto);
      return newSection.save();
   }

   async findAll(): Promise<Section[]> {
      return this.sectionModel.find().exec();
   }

   async findOne(id: Types.ObjectId): Promise<Section> {
      return this.sectionModel.findById(id).exec();
   }

   async update(
      id: Types.ObjectId,
      newData: Partial<CreateSectionDto>,
   ): Promise<Section> {
      return this.sectionModel
         .findByIdAndUpdate(id, newData, {
            new: true,
         })
         .exec();
   }

   async delete(id: Types.ObjectId): Promise<Section> {
      return this.sectionModel.findByIdAndDelete(id).exec();
   }

   async seed(): Promise<void> {
      const dummySections = [
         {
            courseId: '62c13f34f1c5b75e8d9d0b7f',
            instructorId: '000001',
            startTime: '09:00 AM',
            endTime: '12:00 PM',
            days: ['Monday', 'Wednesday', 'Friday'],
            roomCode: '101',
            description: 'Section A',
            availableSlots: 40,
            isActive: true,
         },
         {
            courseId: '672ee6e0adca422f8d35762e',
            instructorId: '000001',
            startTime: '01:00 PM',
            endTime: '04:00 PM',
            days: ['Tuesday', 'Thursday'],
            roomCode: 'R102',
            description: 'Section B',
            availableSlots: 35,
            isActive: true,
         },
         {
            courseId: '672ee6e0adca422f8d357635',
            instructorId: '000001',
            startTime: '09:00 AM',
            endTime: '12:00 PM',
            days: ['Monday', 'Wednesday'],
            roomCode: '103',
            description: 'Section C',
            availableSlots: 30,
            isActive: true,
         },
         {
            courseId: '672ee6e0adca422f8d35763c',
            instructorId: '000001',
            startTime: '01:00 PM',
            endTime: '04:00 PM',
            days: ['Tuesday', 'Thursday'],
            roomCode: '104',
            description: 'Section D',
            availableSlots: 28,
            isActive: true,
         },
         {
            courseId: '672ee6e0adca422f8d357641',
            instructorId: '000001',
            startTime: '10:00 AM',
            endTime: '01:00 PM',
            days: ['Monday', 'Friday'],
            roomCode: '105',
            description: 'Section E',
            availableSlots: 25,
            isActive: true,
         },
      ];

      const courseIds = dummySections.map((section) => section.courseId);
      console.log('Course Ids:', courseIds);
      await this.instructorModel.updateOne(
         { userId: '000001' },
         { $set: { courses: courseIds } },
      );
      await this.sectionModel.insertMany(dummySections);
   }
}
