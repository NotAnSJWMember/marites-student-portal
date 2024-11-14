import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum Status {
   ENROLLED = 'Enrolled',
   COMPLETED = 'Completed',
   NOT_COMPLETED = 'NC',
   INCOMPLETE = 'INC',
}

@Schema({ timestamps: true })
export class Enrollment extends Document {
   @Prop({ required: true, type: Types.ObjectId, ref: 'Course' })
   courseId: Types.ObjectId;

   @Prop({ required: true, type: Types.ObjectId, ref: 'Schedule' })
   scheduleId: Types.ObjectId;

   @Prop({ required: true, ref: 'Student' })
   studentId: string;

   @Prop({ default: 0 })
   prelim: number;

   @Prop({ default: 0 })
   midterm: number;

   @Prop({ default: 0 })
   prefinal: number;

   @Prop({ default: 0 })
   final: number;

   @Prop({ required: true })
   remarks: string;

   @Prop({ enum: Status, default: Status.ENROLLED })
   status: string;

   @Prop({ required: true, default: false })
   dropped: boolean;
}

export const EnrollmentSchema = SchemaFactory.createForClass(Enrollment);
