import { Injectable, NotFoundException } from '@nestjs/common';
import { Course } from './course.schema';
import { CreateCourseDto } from './course.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from '../user/user.schema';

@Injectable()
export class CourseService {
   constructor(
      @InjectModel(User.name) private instructorModel: Model<User>,
      @InjectModel(Course.name) private courseModel: Model<Course>,
   ) {}

   async create(createCourseDto: CreateCourseDto): Promise<Course> {
      const newCourse = new this.courseModel(createCourseDto);
      return newCourse.save();
   }

   async findAll(): Promise<Course[]> {
      return this.courseModel.find().exec();
   }

   async findOne(id: Types.ObjectId): Promise<Course> {
      const course = await this.courseModel.findById(id).exec();
      if (!course) {
         throw new NotFoundException(`Course with ID ${id} not found`);
      }
      return course;
   }

   async update(
      id: Types.ObjectId,
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

   async delete(id: Types.ObjectId): Promise<Course> {
      const deletedCourse = await this.courseModel.findByIdAndDelete(id).exec();
      if (!deletedCourse) {
         throw new NotFoundException(`Course with ID ${id} not found`);
      }
      return deletedCourse;
   }

   async createDummyData(): Promise<void> {
      const dummyCourses: CreateCourseDto[] = [
         {
            code: 'CS704',
            description: 'Quantum Computing',
            labHour: 2,
            lecHour: 3,
            totalUnit: 4,
         },
      ];

      await this.courseModel.insertMany(dummyCourses);
   }
}
