import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Section } from './section.schema';
import { Model, Types } from 'mongoose';
import { CreateSectionDto } from './section.dto';
import { Instructor } from '../user/roles/instructor/instructor.schema';
import { Schedule } from '../schedule/schedule.schema';
import { CourseService } from '../course/course.service';

@Injectable()
export class SectionService {
   constructor(
      @InjectModel(Section.name)
      private sectionModel: Model<Section>,
      @InjectModel(Schedule.name)
      private scheduleModel: Model<Schedule>,
      @InjectModel(Instructor.name)
      private instructorModel: Model<Instructor>,
      private courseService: CourseService,
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

   // async seed(): Promise<void> {
   //    const dummySections = [
   //       {
   //          courseId: '62c13f34f1c5b75e8d9d0b7f',
   //          instructorId: '000001',
   //          startTime: '09:00 AM',
   //          endTime: '12:00 PM',
   //          days: ['Monday', 'Wednesday', 'Friday'],
   //          roomCode: '101',
   //          description: 'Section A',
   //          availableSlots: 40,
   //          isActive: true,
   //       },
   //    ];

   //    const courseIds = dummySections.map((section) => section.courseId);
   //    await this.instructorModel.updateOne(
   //       { userId: '000001' },
   //       { $set: { courses: courseIds } },
   //    );
   //    await this.sectionModel.insertMany(dummySections);
   // }

   async seed(): Promise<void> {
      const courses = await this.courseService.findAll();
      const courseIds = courses.map((course) => course._id);

      const sections = generateSections(courseIds);

      await this.sectionModel.insertMany(sections);

      function generateSections(courses) {
         const sections = [];
         const daysOptions = [
            ['Monday', 'Tuesday'],
            ['Monday', 'Wednesday'],
            ['Monday', 'Thursday'],
            ['Monday', 'Friday'],
            ['Tuesday', 'Wednesday'],
            ['Tuesday', 'Thursday'],
            ['Tuesday', 'Friday'],
         ];
         const timeSlots = [
            { start: '07:30 AM', end: '9:00 PM' },
            { start: '09:00 AM', end: '10:30 PM' },
            { start: '09:00 AM', end: '12:00 PM' },
            { start: '10:00 AM', end: '12:00 PM' },
            { start: '10:30 AM', end: '12:00 PM' },
            { start: '01:00 PM', end: '02:30 PM' },
            { start: '01:00 PM', end: '03:00 PM' },
            { start: '01:00 PM', end: '04:00 PM' },
            { start: '02:30 PM', end: '04:00 PM' },
            { start: '03:00 PM', end: '06:00 PM' },
            { start: '04:00 PM', end: '05:30 PM' },
            { start: '05:30 PM', end: '07:00 PM' },
            { start: '06:00 PM', end: '07:30 PM' },
         ];
         const roomCodes = ['101', '102', '103', '104', '105', '319', '318'];

         let sectionCounter = 1;

         function createSection(courseId) {
            const days = daysOptions[sectionCounter % daysOptions.length];
            const timeSlot = timeSlots[sectionCounter % timeSlots.length];
            const roomCode = roomCodes[sectionCounter % roomCodes.length];
            const sectionLetter = String.fromCharCode(
               65 + ((sectionCounter - 1) % 26),
            );

            return {
               _id: new Types.ObjectId(),
               courseId,
               instructorId: '000001',
               startTime: timeSlot.start,
               endTime: timeSlot.end,
               days,
               roomCode,
               description: `Section ${sectionLetter}`,
               capacity: 0,
               availableSlots: Math.floor(Math.random() * 20) + 20,
               isActive: true,
               createdAt: new Date().toISOString(),
               updatedAt: new Date().toISOString(),
            };
         }

         courses.forEach((courseId) => {
            for (let i = 0; i < 3; i++) {
               sections.push(createSection(courseId));
               sectionCounter++;
            }
         });

         return sections;
      }
   }
}
