import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Enrollment extends Document {
   @Prop({ required: true, type: Types.ObjectId })
   enrollmentId: Types.ObjectId;

   @Prop({ required: true, type: Types.ObjectId, ref: 'Schedule' })
   scheduleId: Types.ObjectId;

   @Prop({ required: true, type: Types.ObjectId, ref: 'Curriculum' })
   curriculumId: Types.ObjectId;

   @Prop({ required: true, type: Types.ObjectId, ref: 'Program' })
   programId: Types.ObjectId;

   @Prop({ required: true, ref: 'User' })
   userId: string;

   @Prop({ required: true })
   major: string;

   @Prop({ required: true })
   yearLevel: number;

   @Prop({ required: true })
   midterm: number;

   @Prop({ required: true })
   final: number;

   @Prop({ required: true })
   remarks: string;

   @Prop({ required: true, default: false })
   dropped: boolean;

   @Prop({ required: true, type: Date, default: Date.now() })
   dateEnrolled: Date;
}

export const EnrollmentSchema = SchemaFactory.createForClass(Enrollment);
