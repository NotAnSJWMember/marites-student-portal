import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Course extends Document {
   @Prop({ type: [Types.ObjectId], ref: 'Course', default: [] })
   prerequisites: Types.ObjectId[];

   @Prop({ required: true, unique: true })
   code: string;

   @Prop({ required: true, unique: true })
   description: string;

   @Prop({ required: true })
   labHour: number;

   @Prop({ required: true })
   lecHour: number;

   @Prop({ required: true })
   totalUnit: number;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
