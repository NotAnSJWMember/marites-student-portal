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

   @Prop({
      type: [
         {
            schoolYear: { type: String, required: true },
            semester: { type: Number, required: true },
            tuitionFee: { type: Number, required: true },
         },
      ],
      required: true,
   })
   fees: {
      schoolYear: string;
      semester: number;
      tuitionFee: number;
   }[];

   @Prop({
      type: [
         {
            feeType: { type: String, required: true },
            description: { type: String, required: false },
            amount: { type: Number, required: true },
         },
      ],
   })
   miscellaneousFees: {
      feeType: string;
      description: string;
      amount: number;
   }[];
}

export const ProgramSchema = SchemaFactory.createForClass(Program);
