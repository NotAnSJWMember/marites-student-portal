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

   @Prop({ required: true })
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
            grade: Number,
         },
      ],
      default: [],
   })
   courseRecords: {
      courseId: Types.ObjectId;
      status: string;
      grade?: number;
   }[];
}

export const StudentSchema = SchemaFactory.createForClass(Student);
