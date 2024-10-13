import { Module } from '@nestjs/common';
import { AssignmentService } from './assignment.service';

@Module({
  providers: [AssignmentService]
})
export class AssignmentModule {}
