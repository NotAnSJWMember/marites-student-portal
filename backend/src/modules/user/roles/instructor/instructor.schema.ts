import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { User } from '../../user.schema';

export enum Department {
   CCOMPUTER_SCIENCE = 'Computer Science',
   MATHEMATICS = 'Mathematics',
   PHYSICS = 'Physics',
   CHEMISTRY = 'Chemistry',
   BIOLOGY = 'Biology',
   ENGINEERING = 'Engineering',
   BUSINESS = 'Business',
}

@Schema({ timestamps: true })
export class Instructor extends User {
   @Prop({ type: [{ type: Types.ObjectId, ref: 'Course' }], default: [] })
   courses: Types.ObjectId[];

   @Prop({ required: true, enum: Object.values(Department) })
   department: Department;

   @Prop({ default: 'instructor' })
   role: string;
}

export const InstructorSchema = SchemaFactory.createForClass(Instructor);
