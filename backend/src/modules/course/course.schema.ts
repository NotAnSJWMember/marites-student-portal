import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Course extends Document {
   @Prop({ required: true, type: Types.ObjectId })
   courseId: Types.ObjectId;

   @Prop({ required: true, unique: true })
   courseCode: string;

   @Prop({ required: true, unique: true })
   courseDescription: string;

   @Prop({ required: true })
   labHour: number;

   @Prop({ required: true })
   lecHour: number;

   @Prop({ required: true })
   totalUnit: number;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
