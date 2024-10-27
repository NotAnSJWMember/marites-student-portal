import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Program extends Document {
   @Prop({ required: true, type: Types.ObjectId })
   programId: Types.ObjectId;

   @Prop({ required: true })
   programDescription: string;

   @Prop({ required: true })
   collegeCode: string;

   @Prop({ required: true })
   duration: number;
}

export const ProgramSchema = SchemaFactory.createForClass(Program);
