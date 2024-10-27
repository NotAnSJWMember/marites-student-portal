import { Injectable, NotFoundException } from '@nestjs/common';
import { Course } from './course.schema';
import { CreateCourseDto } from './course.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class CourseService {
   constructor(@InjectModel(Course.name) private courseModel: Model<Course>) {}

   async create(createCourseDto: CreateCourseDto): Promise<Course> {
      const newCourse = new this.courseModel(createCourseDto);
      return newCourse.save();
   }

   async findAll(): Promise<Course[]> {
      return this.courseModel.find().exec();
   }

   async findOne(id: string): Promise<Course> {
      const course = await this.courseModel.findById(id).exec();
      if (!course) {
         throw new NotFoundException(`Course with ID ${id} not found`);
      }
      return course;
   }

   async update(
      id: string,
      updateCourseDto: Partial<CreateCourseDto>,
   ): Promise<Course> {
      const updatedCourse = await this.courseModel
         .findByIdAndUpdate(id, updateCourseDto, { new: true })
         .exec();
      if (!updatedCourse) {
         throw new NotFoundException(`Course with ID ${id} not found`);
      }
      return updatedCourse;
   }

   async delete(id: string): Promise<Course> {
      const deletedCourse = await this.courseModel.findByIdAndDelete(id).exec();
      if (!deletedCourse) {
         throw new NotFoundException(`Course with ID ${id} not found`);
      }
      return deletedCourse;
   }

   async createDummyData(): Promise<void> {
      const dummyCourses: CreateCourseDto[] = [
         // General Education & Core Subjects
         {
            courseId: new Types.ObjectId(),
            courseCode: 'MATH102',
            courseDescription: 'Calculus I',
            labHour: 0,
            lecHour: 4,
            totalUnit: 4,
         },
         {
            courseId: new Types.ObjectId(),
            courseCode: 'MATH103',
            courseDescription: 'Linear Algebra',
            labHour: 0,
            lecHour: 3,
            totalUnit: 3,
         },
         {
            courseId: new Types.ObjectId(),
            courseCode: 'PHY101',
            courseDescription: 'General Physics I',
            labHour: 1,
            lecHour: 3,
            totalUnit: 4,
         },
         {
            courseId: new Types.ObjectId(),
            courseCode: 'PHY102',
            courseDescription: 'General Physics II',
            labHour: 1,
            lecHour: 3,
            totalUnit: 4,
         },
         {
            courseId: new Types.ObjectId(),
            courseCode: 'CHEM101',
            courseDescription: 'General Chemistry',
            labHour: 2,
            lecHour: 2,
            totalUnit: 4,
         },
         {
            courseId: new Types.ObjectId(),
            courseCode: 'BIO101',
            courseDescription: 'Introduction to Biology',
            labHour: 2,
            lecHour: 2,
            totalUnit: 4,
         },
         {
            courseId: new Types.ObjectId(),
            courseCode: 'STAT101',
            courseDescription: 'Introduction to Statistics',
            labHour: 0,
            lecHour: 3,
            totalUnit: 3,
         },
         {
            courseId: new Types.ObjectId(),
            courseCode: 'HUM101',
            courseDescription: 'Introduction to Philosophy',
            labHour: 0,
            lecHour: 3,
            totalUnit: 3,
         },
         {
            courseId: new Types.ObjectId(),
            courseCode: 'HUM102',
            courseDescription: 'Art Appreciation',
            labHour: 0,
            lecHour: 3,
            totalUnit: 3,
         },
         {
            courseId: new Types.ObjectId(),
            courseCode: 'SOC101',
            courseDescription: 'Introduction to Sociology',
            labHour: 0,
            lecHour: 3,
            totalUnit: 3,
         },

         // IT & Computer Science Related
         {
            courseId: new Types.ObjectId(),
            courseCode: 'BSIT405',
            courseDescription: 'Artificial Intelligence',
            labHour: 1,
            lecHour: 2,
            totalUnit: 3,
         },
         {
            courseId: new Types.ObjectId(),
            courseCode: 'BSIT406',
            courseDescription: 'Cloud Computing',
            labHour: 2,
            lecHour: 2,
            totalUnit: 4,
         },
         {
            courseId: new Types.ObjectId(),
            courseCode: 'BSIT407',
            courseDescription: 'Advanced Programming Techniques',
            labHour: 2,
            lecHour: 3,
            totalUnit: 5,
         },
         {
            courseId: new Types.ObjectId(),
            courseCode: 'BSIT408',
            courseDescription: 'Game Development',
            labHour: 2,
            lecHour: 2,
            totalUnit: 4,
         },
         {
            courseId: new Types.ObjectId(),
            courseCode: 'BSIT409',
            courseDescription: 'Blockchain Technology',
            labHour: 1,
            lecHour: 2,
            totalUnit: 3,
         },
         {
            courseId: new Types.ObjectId(),
            courseCode: 'BSIT410',
            courseDescription: 'Internet of Things (IoT)',
            labHour: 2,
            lecHour: 2,
            totalUnit: 4,
         },
         {
            courseId: new Types.ObjectId(),
            courseCode: 'BSIT411',
            courseDescription: 'Big Data Analytics',
            labHour: 2,
            lecHour: 2,
            totalUnit: 4,
         },
         {
            courseId: new Types.ObjectId(),
            courseCode: 'BSIT412',
            courseDescription: 'Machine Learning',
            labHour: 2,
            lecHour: 2,
            totalUnit: 4,
         },

         // Business & Economics
         {
            courseId: new Types.ObjectId(),
            courseCode: 'BUS101',
            courseDescription: 'Principles of Management',
            labHour: 0,
            lecHour: 3,
            totalUnit: 3,
         },
         {
            courseId: new Types.ObjectId(),
            courseCode: 'BUS102',
            courseDescription: 'Principles of Marketing',
            labHour: 0,
            lecHour: 3,
            totalUnit: 3,
         },
         {
            courseId: new Types.ObjectId(),
            courseCode: 'ECO101',
            courseDescription: 'Introduction to Microeconomics',
            labHour: 0,
            lecHour: 3,
            totalUnit: 3,
         },
         {
            courseId: new Types.ObjectId(),
            courseCode: 'ECO102',
            courseDescription: 'Introduction to Macroeconomics',
            labHour: 0,
            lecHour: 3,
            totalUnit: 3,
         },
      ];

      await this.courseModel.insertMany(dummyCourses);
   }
}
