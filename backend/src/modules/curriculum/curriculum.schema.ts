import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Curriculum extends Document {
   @Prop({ required: true, ref: 'Program' })
   programId: Types.ObjectId;

   @Prop({ required: true, type: [Types.ObjectId], ref: 'Course' })
   courses: Types.ObjectId[];

   @Prop({ type: [Types.ObjectId], ref: 'Course', default: [] })
   electiveCourses: Types.ObjectId[];

   @Prop({ required: true })
   yearLevel: number;

   @Prop({ required: true })
   semester: number;
}

export const CurriculumSchema = SchemaFactory.createForClass(Curriculum);
