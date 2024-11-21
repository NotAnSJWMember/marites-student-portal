import {
   Body,
   Controller,
   Delete,
   Get,
   Param,
   Post,
   Put,
} from '@nestjs/common';
import { ProgramService } from './program.service';
import { CreateProgramDto } from './program.dto';
import { Program } from './program.schema';
import { Types } from 'mongoose';

@Controller('program')
export class ProgramController {
   constructor(private readonly programService: ProgramService) {}

   @Post()
   async create(@Body() createProgramDto: CreateProgramDto): Promise<Program> {
      return this.programService.create(createProgramDto);
   }

   @Get()
   async findAll(): Promise<Program[]> {
      return this.programService.findAll();
   }

   @Get(':id')
   async findOne(@Param('id') id: Types.ObjectId): Promise<Program> {
      return this.programService.findOne(id);
   }

   @Put(':id')
   async update(
      @Param('id') id: Types.ObjectId,
      @Body() newData: Partial<CreateProgramDto>,
   ): Promise<Program> {
      return this.programService.update(id, newData);
   }

   @Delete(':id')
   async delete(@Param('id') id: Types.ObjectId): Promise<Program> {
      return this.programService.delete(id);
   }

   @Post('seed')
   async seed() {
      return await this.programService.createMiscFees();
   }
}
