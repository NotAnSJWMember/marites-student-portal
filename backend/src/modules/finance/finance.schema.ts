import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Finance extends Document {
   @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
   userId: Types.ObjectId;

   @Prop({ required: true })
   description: string;

   @Prop({
      required: true,
      enum: ['Tuition', 'Miscellaneous', 'Others'],
   })
   category: string;

   @Prop({ required: true, type: Number })
   amount: number;

   @Prop({ type: Date, required: true })
   dueDate: Date;

   @Prop({ type: Date })
   paidDate: Date;

   @Prop({
      required: true,
      enum: ['Pending', 'Paid', 'Overdue'],
      default: 'Pending',
   })
   status: string;
}

export const FinanceSchema = SchemaFactory.createForClass(Finance);
