import {
   Controller,
   Post,
   Get,
   Param,
   Body,
   Put,
   Delete,
} from '@nestjs/common';
import { CurriculumService } from './curriculum.service';
import { CreateCurriculumDto } from './curriculum.dto';
import { Curriculum } from './curriculum.schema';
import { Types } from 'mongoose';

@Controller('curriculum')
export class CurriculumController {
   constructor(private readonly curriculumService: CurriculumService) {}

   @Post()
   async create(
      @Body() createCurriculumDto: CreateCurriculumDto,
   ): Promise<Curriculum> {
      return this.curriculumService.create(createCurriculumDto);
   }

   @Get()
   async findAll(): Promise<Curriculum[]> {
      return this.curriculumService.findAll();
   }

   @Get(':id')
   async findOne(@Param('id') id: Types.ObjectId): Promise<Curriculum> {
      return this.curriculumService.findOne(id);
   }

   @Put(':id')
   async update(
      @Param('id') id: Types.ObjectId,
      @Body() updateData: Partial<CreateCurriculumDto>,
   ): Promise<Curriculum> {
      return this.curriculumService.update(id, updateData);
   }

   @Delete(':id')
   async delete(@Param('id') id: Types.ObjectId): Promise<Curriculum> {
      return this.curriculumService.delete(id);
   }
}
