import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '../../user.schema';

@Schema({ timestamps: true })
export class Admin extends User {
   @Prop({ required: true })
   adminLevel: string;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
