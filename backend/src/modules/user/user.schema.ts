import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
   @Prop({ unique: true })
   userId: string;

   @Prop({ required: true })
   firstName: string;

   @Prop({ required: true })
   lastName: string;

   @Prop({ type: String, default: null })
   userPhoto: string;

   @Prop({ required: true, unique: true, match: /.+\@.+\..+/ })
   email: string;

   @Prop({ required: true, type: String, match: /^\+?\d{10,15}$/ })
   phoneNum: string;

   @Prop({ type: Date, required: true })
   birthDate: Date;

   @Prop({ required: true, enum: ['Male', 'Female', 'Other'] })
   gender: string;

   @Prop({ required: true, unique: true })
   username: string;

   @Prop({ required: true })
   password: string;

   @Prop({ default: 'student' })
   role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('fullName').get(function () {
   return `${this.firstName} ${this.lastName}`;
});
