import { Controller, Post } from '@nestjs/common';
import { ProgramService } from './program.service';

@Controller('program')
export class ProgramController {
   constructor(private readonly programService: ProgramService) {}

   @Post('seed')
   async seed(): Promise<string> {
      await this.programService.createDummyPrograms();
      return 'Dummy courses created successfully.';
   }
}
