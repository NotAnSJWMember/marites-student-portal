import {
   BadRequestException,
   Injectable,
   NotFoundException,
} from '@nestjs/common';
import { Course } from './course.schema';
import { CreateCourseDto } from './course.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from '../user/user.schema';

@Injectable()
export class CourseService {
   constructor(
      @InjectModel(User.name) private userModel: Model<User>,
      @InjectModel(Course.name) private courseModel: Model<Course>,
   ) {}

   async create(createCourseDto: CreateCourseDto): Promise<Course> {
      const { instructorId } = createCourseDto;

      const instructor = await this.userModel.findOne({
         userId: instructorId,
         role: 'instructor',
      });

      if (!instructor)
         throw new BadRequestException(
            `The instructor ID (${instructorId}) provided does not belong to the role instructor.`,
         );

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
         {
            courseId: new Types.ObjectId(),
            instructorId: '000001',
            courseCode: 'TITTT',
            courseDescription: 'Calculus XXX',
            labHour: 0,
            lecHour: 4,
            totalUnit: 4,
         },
      ];

      await this.courseModel.insertMany(dummyCourses);
   }

   async testData(id: string): Promise<void> {
      const courses: Course[] = await this.findAll();

      console.log(id);
      console.log(courses);

      for (const course of courses) {
         console.log(course.instructorId);
      }

      // this.courseModel.findOne({
      //    instructorId:
      // })
   }
}
