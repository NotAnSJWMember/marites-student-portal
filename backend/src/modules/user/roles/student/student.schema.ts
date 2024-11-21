import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { User } from '../../user.schema';

@Schema({ timestamps: true })
export class Student extends User {
   @Prop({ required: true, type: Types.ObjectId, ref: 'Program' })
   programId: Types.ObjectId;

   @Prop({ type: Types.ObjectId, ref: 'Curriculum' })
   curriculumId: Types.ObjectId;

   @Prop({ default: false })
   enrollmentStatus: boolean;

   @Prop({ type: Date })
   enrollmentDate: Date;

   @Prop({ required: true, default: 1, min: 1, max: 5 })
   yearLevel: number;

   @Prop({ default: 1, min: 1, max: 2 })
   currentSemester: number;

   @Prop({ type: [{ type: Types.ObjectId, ref: 'Finance' }] })
   financeRecords: Types.ObjectId[];
}

export const StudentSchema = SchemaFactory.createForClass(Student);
