import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type StudentDocument = Student & Document;

@Schema()
export class Student {
  @Prop({ required: true, unique: true })
  studentID: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true, match: /.+\@.+\..+/ })
  email: string;

  @Prop({ required: true })
  birthDate: Date;

  @Prop({ required: true, enum: ['Male', 'Female', 'Other'] })
  sex: string;

  @Prop({ required: true })
  programme: string;

  @Prop({ required: true })
  year: number;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: Date.now(), required: true })
  createdAt: Date;
}

export const StudentSchema = SchemaFactory.createForClass(Student);
