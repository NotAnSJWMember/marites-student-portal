import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type StudentDocument = Student & Document;

@Schema()
export class Student {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  course: string;

  @Prop({ required: true })
  year: number;

  @Prop({ required: true, enum: ['Male', 'Female', 'Other'] })
  sex: string;

  @Prop({ required: true })
  createdAt: Date;
}

export const StudentSchema = SchemaFactory.createForClass(Student);
