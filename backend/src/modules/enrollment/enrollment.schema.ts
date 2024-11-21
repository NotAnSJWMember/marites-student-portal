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

   @Prop({ required: true })
   studentId: string;

   @Prop({ required: true, enum: ['core', 'elective'] })
   type: string;

   @Prop({ type: String, required: true })
   schoolYear: string;

   @Prop({ required: true, min: 1, max: 2 })
   semester: number;

   @Prop({ default: 0.0, min: 0.0, max: 5.0 })
   prelim: number;

   @Prop({ default: 0.0, min: 0.0, max: 5.0 })
   midterm: number;

   @Prop({ default: 0.0, min: 0.0, max: 5.0 })
   prefinal: number;

   @Prop({ default: 0.0, min: 0.0, max: 5.0 })
   final: number;

   @Prop({ required: true })
   remarks: string;

   @Prop({ enum: Status, default: Status.ENROLLED })
   status: string;

   @Prop({ required: true, default: false })
   dropped: boolean;

   @Prop({ type: String, required: false })
   finalGrade?: string;

   @Prop({ required: false })
   completionDate?: Date;
}

export const EnrollmentSchema = SchemaFactory.createForClass(Enrollment);
