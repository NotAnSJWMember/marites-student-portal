import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Section extends Document {
   @Prop({ required: true })
   description: string;

   @Prop({ default: 40 })
   availableSlots: number;

   @Prop({ default: true })
   isActive: boolean;
}

export const SectionSchema = SchemaFactory.createForClass(Section);
