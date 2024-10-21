import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Course extends Document {
   @Prop({ required: true, type: Types.ObjectId })
   courseId: Types.ObjectId;

   @Prop({ required: true })
   courseCode: string;

   @Prop({ required: true })
   courseDescription: string;

   @Prop({ required: true })
   labHour: number;

   @Prop({ required: true })
   lecHour: number;

   @Prop({ required: true })
   totalUnit: number;

   @Prop({ default: Date.now() })
   createdAt: Date;

   @Prop({ default: Date.now() })
   updateAt: Date;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
