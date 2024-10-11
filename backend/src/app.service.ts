import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
   getHello(): string {
      return 'What are you doing here?!';
   }
}
