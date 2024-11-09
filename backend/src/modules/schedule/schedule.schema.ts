import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Schedule extends Document {
   @Prop({ required: true, type: Types.ObjectId, ref: 'Course' })
   courseId: Types.ObjectId;

   @Prop({ required: true, type: Types.ObjectId, ref: 'Section' })
   sectionId: Types.ObjectId;

   @Prop({ required: true, ref: 'Student' })
   studentId: string;
}

export const ScheduleSchema = SchemaFactory.createForClass(Schedule);
