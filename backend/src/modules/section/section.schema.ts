import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Section extends Document {
   @Prop({ required: true, type: Types.ObjectId, ref: 'Course' })
   courseId: Types.ObjectId;

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

   @Prop({ required: true })
   description: string;

   @Prop({ default: 0 })
   capacity: number;

   @Prop({ default: 40, min: 1 })
   availableSlots: number;

   @Prop({ default: true })
   isActive: boolean;
}

export const SectionSchema = SchemaFactory.createForClass(Section);
