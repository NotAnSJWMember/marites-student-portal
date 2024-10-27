import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Instructor } from 'src/modules/user/roles/instructor/instructor.schema';
import { User } from 'src/modules/user/user.schema';

@Injectable()
export class IdGenerator {
   constructor(
      @InjectModel(User.name) private readonly userModel: Model<User>,
      @InjectModel(Instructor.name)
      private readonly instructorModel: Model<Instructor>,
   ) {}

   async generateId(): Promise<string> {
      const min = 100000;
      const max = 999999;

      let userId: string;
      let isUnique = false;

      let retries = 0;
      const maxRetries = 10;

      while (!isUnique && retries < maxRetries) {
         userId = Math.floor(Math.random() * (max - min + 1) + min).toString();
         const userExists = await this.userModel.findOne({ userId });
         const instructorExists = await this.instructorModel.findOne({
            userId,
         });
         if (!userExists && !instructorExists) {
            isUnique = true;
         }
         retries++;
      }

      if (!isUnique) {
         throw new Error(
            'Failed to generate a unique ID after multiple attempts.',
         );
      }

      return userId;
   }
}
