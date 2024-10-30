import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { User } from '../../user.schema';

export enum Status {
   ENROLLED = 'Enrolled',
   COMPLETED = 'Completed',
   NOT_COMPLETED = 'NC',
   INCOMPLETE = 'INC',
}

@Schema({ timestamps: true })
export class Student extends User {
   @Prop({ required: true, type: Types.ObjectId, ref: 'Program' })
   programId: Types.ObjectId;

   @Prop({ required: true })
   yearLevel: number;

   @Prop({ default: true })
   enrollmentStatus: boolean;

   @Prop({ type: Date, default: Date.now() })
   enrollmentDate: Date;

   @Prop({ default: 1, required: true, min: 1 })
   currentSemester: number;

   @Prop({
      type: [
         {
            courseId: { type: Types.ObjectId, ref: 'Course' },
            status: {
               type: String,
               enum: Object.values(Status),
               default: 'enrolled',
            },
            grade: { type: Number, min: 0, max: 100 },
         },
      ],
      default: [],
   })
   courseRecords: {
      courseId: Types.ObjectId;
      status: string;
      grade?: number;
   }[];

   @Prop({ type: [Types.ObjectId], ref: 'Course' })
   courses: Types.ObjectId[];
}

export const StudentSchema = SchemaFactory.createForClass(Student);
