import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { formatTime } from 'src/common/utils/time.helper';

@Schema({ timestamps: true })
export class Schedule extends Document {
   @Prop({ required: true, type: Types.ObjectId })
   scheduleId: Types.ObjectId;

   @Prop({ required: true, ref: 'User' })
   userId: string;

   @Prop({ required: true, type: Types.ObjectId, ref: 'Course' })
   courseId: Types.ObjectId;

   @Prop({ required: true, type: Types.ObjectId, ref: 'Program' })
   programId: Types.ObjectId;

   @Prop({ required: true, type: Types.ObjectId, ref: 'BlockSection' })
   blockId: Types.ObjectId;

   @Prop({ required: true })
   syNo: string;

   @Prop({ required: true })
   time: string;

   @Prop({
      required: true,
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
   day: string;

   @Prop({ required: true })
   roomCode: string;

   get formattedTime(): string {
      return formatTime(this.time);
   }
}

export const ScheduleSchema = SchemaFactory.createForClass(Schedule);
