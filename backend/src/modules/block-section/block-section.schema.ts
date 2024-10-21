import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class BlockSection extends Document {
   @Prop({ required: true, type: Types.ObjectId })
   blockId: Types.ObjectId;

   @Prop({ required: true })
   blockDescription: string;

   @Prop({ default: true })
   blockActive: boolean;
}

export const BlockSectionSchema = SchemaFactory.createForClass(BlockSection);
