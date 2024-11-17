import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { User } from '../../user.schema';

@Schema({ timestamps: true })
export class Student extends User {
   @Prop({ required: true, type: Types.ObjectId, ref: 'Program' })
   programId: Types.ObjectId;

   @Prop({ type: Types.ObjectId, ref: 'Curriculum' })
   curriculumId: Types.ObjectId;

   @Prop({ default: 1, required: true, min: 1, max: 5 })
   yearLevel: number;

   @Prop({ default: 1, required: true, min: 1, max: 2 })
   currentSemester: number;

   @Prop({ default: false })
   enrollmentStatus: boolean;

   @Prop({ type: Date, default: Date.now() })
   enrollmentDate: Date;
}

export const StudentSchema = SchemaFactory.createForClass(Student);
