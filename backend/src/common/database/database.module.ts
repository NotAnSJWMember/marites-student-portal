import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/modules/user/user.schema';

@Module({
   imports: [
      MongooseModule.forRoot(process.env.MONGODB_URI),
      MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
   ],
   exports: [MongooseModule],
})
export class DatabaseModule {}
