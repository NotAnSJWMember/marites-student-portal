import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Section extends Document {
   @Prop({ required: true, type: Types.ObjectId })
   sectionId: Types.ObjectId;

   @Prop({ required: true })
   sectionDescription: string;

   @Prop({ default: true })
   sectionActive: boolean;
}

export const SectionSchema = SchemaFactory.createForClass(Section);
