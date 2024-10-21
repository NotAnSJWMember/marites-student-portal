import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Notification extends Document {
   @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
   userId: Types.ObjectId;

   @Prop({ required: true })
   message: string;

   @Prop({ enum: ['Info', 'Warning', 'Alert', 'Reminder'], default: 'Info' })
   type: string;

   @Prop({ required: true, type: Boolean, default: false })
   read: boolean;

   @Prop({ type: Date, default: Date.now })
   sentAt: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
