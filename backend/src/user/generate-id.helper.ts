import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UserService } from './user.service';

@Injectable()
export class IdGenerator {
   constructor(
      @Inject(forwardRef(() => UserService))
      private readonly userService: UserService,
   ) {}

   async generateId(): Promise<string> {
      const min = 100000;
      const max = 999999;

      let userId: string;
      let isUnique = false;

      while (!isUnique) {
         userId = Math.floor(Math.random() * (max - min + 1) + min).toString();
         const userExists = await this.userService.findOne(userId);
         if (!userExists) {
            isUnique = true;
         }
      }

      return userId;
   }
}
