import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Instructor extends Document {
   @Prop({ required: true, unique: true, ref: 'User' })
   userId: string;

   @Prop({ default: 'instructor' })
   role: string;
}

export const InstructorSchema = SchemaFactory.createForClass(Instructor);
