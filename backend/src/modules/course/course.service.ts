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
            code: 'CS101',
            description: 'Introduction to Computer Science',
            labHour: 2,
            lecHour: 2,
            totalUnit: 3,
         },
         {
            code: 'MATH101',
            description: 'Calculus I',
            labHour: 0,
            lecHour: 3,
            totalUnit: 3,
         },
         {
            code: 'ENG101',
            description: 'English Composition',
            labHour: 0,
            lecHour: 3,
            totalUnit: 3,
         },
         {
            code: 'CS102',
            description: 'Data Structures',
            labHour: 2,
            lecHour: 2,
            totalUnit: 3,
         },
         {
            code: 'PHYS101',
            description: 'General Physics I',
            labHour: 2,
            lecHour: 3,
            totalUnit: 4,
         },
         {
            code: 'CHEM101',
            description: 'Chemistry I',
            labHour: 2,
            lecHour: 2,
            totalUnit: 3,
         },
         {
            code: 'BIO101',
            description: 'Biology I',
            labHour: 2,
            lecHour: 2,
            totalUnit: 3,
         },
         {
            code: 'HIST101',
            description: 'World History',
            labHour: 0,
            lecHour: 3,
            totalUnit: 3,
         },
         {
            code: 'SOC101',
            description: 'Introduction to Sociology',
            labHour: 0,
            lecHour: 3,
            totalUnit: 3,
         },
         {
            code: 'PHIL101',
            description: 'Philosophy',
            labHour: 0,
            lecHour: 3,
            totalUnit: 3,
         },
         {
            code: 'CS201',
            description: 'Algorithms',
            labHour: 2,
            lecHour: 3,
            totalUnit: 4,
         },
         {
            code: 'STAT101',
            description: 'Statistics',
            labHour: 1,
            lecHour: 2,
            totalUnit: 3,
         },
         {
            code: 'ECON101',
            description: 'Introduction to Economics',
            labHour: 0,
            lecHour: 3,
            totalUnit: 3,
         },
         {
            code: 'ENG201',
            description: 'Technical Writing',
            labHour: 0,
            lecHour: 3,
            totalUnit: 3,
         },
         {
            code: 'CS301',
            description: 'Database Management Systems',
            labHour: 2,
            lecHour: 3,
            totalUnit: 4,
         },
         {
            code: 'MATH201',
            description: 'Linear Algebra',
            labHour: 0,
            lecHour: 3,
            totalUnit: 3,
         },
         {
            code: 'MATH202',
            description: 'Discrete Mathematics',
            labHour: 0,
            lecHour: 3,
            totalUnit: 3,
         },
         {
            code: 'CS401',
            description: 'Software Engineering',
            labHour: 2,
            lecHour: 3,
            totalUnit: 4,
         },
         {
            code: 'CS402',
            description: 'Operating Systems',
            labHour: 2,
            lecHour: 3,
            totalUnit: 4,
         },
         {
            code: 'CS403',
            description: 'Computer Networks',
            labHour: 2,
            lecHour: 3,
            totalUnit: 4,
         },
         {
            code: 'CS404',
            description: 'Web Development',
            labHour: 2,
            lecHour: 3,
            totalUnit: 4,
         },
         {
            code: 'CS405',
            description: 'Mobile App Development',
            labHour: 2,
            lecHour: 3,
            totalUnit: 4,
         },
         {
            code: 'CS406',
            description: 'Cloud Computing',
            labHour: 2,
            lecHour: 3,
            totalUnit: 4,
         },
         {
            code: 'MATH301',
            description: 'Advanced Calculus',
            labHour: 0,
            lecHour: 3,
            totalUnit: 3,
         },
         {
            code: 'MATH302',
            description: 'Complex Analysis',
            labHour: 0,
            lecHour: 3,
            totalUnit: 3,
         },
         {
            code: 'CS501',
            description: 'Artificial Intelligence',
            labHour: 2,
            lecHour: 3,
            totalUnit: 4,
         },
         {
            code: 'CS502',
            description: 'Machine Learning',
            labHour: 2,
            lecHour: 3,
            totalUnit: 4,
         },
         {
            code: 'CS503',
            description: 'Cybersecurity',
            labHour: 2,
            lecHour: 3,
            totalUnit: 4,
         },
         {
            code: 'MATH401',
            description: 'Probability and Statistics',
            labHour: 1,
            lecHour: 2,
            totalUnit: 3,
         },
         {
            code: 'ENG301',
            description: 'Business Communication',
            labHour: 0,
            lecHour: 3,
            totalUnit: 3,
         },
         {
            code: 'PHYS201',
            description: 'General Physics II',
            labHour: 2,
            lecHour: 3,
            totalUnit: 4,
         },
         {
            code: 'CHEM201',
            description: 'Organic Chemistry',
            labHour: 2,
            lecHour: 3,
            totalUnit: 4,
         },
         {
            code: 'BIO201',
            description: 'Biology II',
            labHour: 2,
            lecHour: 3,
            totalUnit: 4,
         },
         {
            code: 'HIST201',
            description: 'History of the Philippines',
            labHour: 0,
            lecHour: 3,
            totalUnit: 3,
         },
         {
            code: 'ECON201',
            description: 'Microeconomics',
            labHour: 0,
            lecHour: 3,
            totalUnit: 3,
         },
         {
            code: 'CS601',
            description: 'Distributed Systems',
            labHour: 2,
            lecHour: 3,
            totalUnit: 4,
         },
         {
            code: 'CS602',
            description: 'Big Data Analytics',
            labHour: 2,
            lecHour: 3,
            totalUnit: 4,
         },
         {
            code: 'CS603',
            description: 'Blockchain Technology',
            labHour: 2,
            lecHour: 3,
            totalUnit: 4,
         },
         {
            code: 'MATH402',
            description: 'Mathematical Modeling',
            labHour: 0,
            lecHour: 3,
            totalUnit: 3,
         },
         {
            code: 'MATH403',
            description: 'Numerical Analysis',
            labHour: 1,
            lecHour: 2,
            totalUnit: 3,
         },
         {
            code: 'CS701',
            description: 'Capstone Project',
            labHour: 0,
            lecHour: 6,
            totalUnit: 6,
         },
         {
            code: 'ENG401',
            description: 'Research Writing',
            labHour: 0,
            lecHour: 3,
            totalUnit: 3,
         },
      ];

      await this.courseModel.insertMany(dummyCourses);
   }
}
