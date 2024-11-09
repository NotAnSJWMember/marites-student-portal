import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Schedule extends Document {
   @Prop({ required: true, type: Types.ObjectId, ref: 'Course' })
   courseId: Types.ObjectId;

   @Prop({ required: true, type: Types.ObjectId, ref: 'Section' })
   sectionId: Types.ObjectId;

   @Prop({ required: true, ref: 'Instructor' })
   instructorId: string;

   @Prop({ required: true })
   startTime: string;

   @Prop({ required: true })
   endTime: string;

   @Prop({
      required: true,
      type: [String],
      enum: [
         'Monday',
         'Tuesday',
         'Wednesday',
         'Thursday',
         'Friday',
         'Saturday',
         'Sunday',
      ],
   })
   days: string[];

   @Prop({ required: true })
   roomCode: string;
}

export const ScheduleSchema = SchemaFactory.createForClass(Schedule);
