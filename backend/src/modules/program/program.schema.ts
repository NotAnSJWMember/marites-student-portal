import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Program extends Document {
   @Prop({ required: true, unique: true })
   description: string;

   @Prop({ required: true, unique: true })
   code: string;

   @Prop({ required: true, min: 1, max: 5 })
   duration: number;

   @Prop({ required: true })
   department: string;
}

export const ProgramSchema = SchemaFactory.createForClass(Program);
