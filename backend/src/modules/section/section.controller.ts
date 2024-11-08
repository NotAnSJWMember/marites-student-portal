import {
   Body,
   Controller,
   Delete,
   Get,
   Param,
   Post,
   Put,
} from '@nestjs/common';
import { SectionService } from './section.service';
import { CreateSectionDto } from './section.dto';
import { Section } from './section.schema';
import { Types } from 'mongoose';

@Controller('section')
export class SectionController {
   constructor(private readonly sectionService: SectionService) {}

   @Post()
   async create(@Body() createSectionDto: CreateSectionDto): Promise<Section> {
      return this.sectionService.create(createSectionDto);
   }

   @Get()
   async findAll(): Promise<Section[]> {
      return this.sectionService.findAll();
   }

   @Get(':id')
   async findOne(@Param('id') id: Types.ObjectId): Promise<Section> {
      return this.sectionService.findOne(id);
   }

   @Put(':id')
   async update(
      @Param('id') id: Types.ObjectId,
      @Body() newData: Partial<CreateSectionDto>,
   ): Promise<Section> {
      return this.sectionService.update(id, newData);
   }

   @Delete(':id')
   async delete(@Param('id') id: Types.ObjectId): Promise<Section> {
      return this.sectionService.delete(id);
   }

   @Post('seed')
   async seed(): Promise<void> {
      await this.sectionService.seed();
   }
}
