import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Schedule extends Document {
   @Prop({ required: true, type: Types.ObjectId, ref: 'Course' })
   courseId: Types.ObjectId;

   @Prop({ required: true, type: Types.ObjectId, ref: 'Section' })
   sectionId: Types.ObjectId;

   @Prop({ required: true })
   studentId: string;

   @Prop({ required: true })
   instructor: string;

   @Prop({ required: true })
   startTime: string;

   @Prop({ required: true })
   endTime: string;

   @Prop({ required: true })
   roomCode: string;

   @Prop({ required: true })
   days: string[];

   @Prop({ required: true })
   description: string;
}

export const ScheduleSchema = SchemaFactory.createForClass(Schedule);
