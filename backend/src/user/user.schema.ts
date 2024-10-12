import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum UserRole {
   STUDENT = 'student',
   TEACHER = 'teacher',
   ADMIN = 'admin',
}

export type UserDocument = User & Document;

@Schema()
export class User {
   @Prop({ required: true, unique: true })
   userId: string;

   @Prop({ required: true })
   firstName: string;

   @Prop({ required: true })
   lastName: string;

   @Prop({ required: true, unique: true, match: /.+\@.+\..+/ })
   email: string;

   @Prop({ required: true, type: String })
   phoneNum: string;

   @Prop({ required: true })
   birthDate: Date;

   @Prop({ required: true, enum: ['Male', 'Female', 'Other'] })
   sex: string;

   @Prop({ required: true })
   programme: string;

   @Prop({ required: true })
   year: number;

   @Prop({ required: true, unique: true })
   username: string;

   @Prop({ required: true })
   password: string;

   @Prop({ type: String, enum: UserRole, default: UserRole.STUDENT })
   role: UserRole;

   @Prop({ default: Date.now() })
   createdAt: Date;

   @Prop({ default: Date.now() })
   updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
