import { Injectable } from '@nestjs/common';
import { Course } from './course.schema';
import { CreateCourseDto } from './course.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class CourseService {
   constructor(@InjectModel(Course.name) private CourseModel: Model<Course>) {}

   async create(createCourseDto: CreateCourseDto): Promise<Course> {
      const newCourse = new this.CourseModel(createCourseDto);
      return newCourse.save();
   }

   async findAll(): Promise<Course[]> {
      return this.CourseModel.find().exec();
   }

   async findOne(id: string): Promise<Course> {
      return this.CourseModel.findById(id).exec();
   }

   async update(id: string): Promise<Course> {
      return this.CourseModel.findByIdAndUpdate(id, { new: true }).exec();
   }

   async delete(id: string): Promise<Course> {
      return this.CourseModel.findByIdAndDelete(id).exec();
   }
}
