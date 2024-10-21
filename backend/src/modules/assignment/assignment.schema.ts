import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Assignment extends Document {
   @Prop({ required: true, type: Types.ObjectId })
   assignmentId: Types.ObjectId;

   @Prop({ required: true, type: Types.ObjectId, ref: 'Course' })
   courseId: Types.ObjectId;

   @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
   assignedBy: Types.ObjectId;

   @Prop({ required: true })
   title: string;

   @Prop({ required: true })
   description: string;

   @Prop({ type: Date })
   dueDate: Date;

   @Prop({
      required: true,
      enum: ['Pending', 'Completed', 'Graded', 'Overdue'],
      default: 'Pending',
   })
   assignmentStatus: string;

   @Prop()
   maxPoints: number;

   @Prop({ type: String })
   submissionLink: string;
}

export const AssignmentSchema = SchemaFactory.createForClass(Assignment);
