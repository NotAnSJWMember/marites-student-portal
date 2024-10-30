import {
   Body,
   Controller,
   Delete,
   Get,
   Param,
   Post,
   Put,
} from '@nestjs/common';
import { BlockSectionService } from './block-section.service';
import { CreateBlockSectionDto } from './block-section.dto';
import { BlockSection } from './block-section.schema';
import { Types } from 'mongoose';

@Controller('block-section')
export class BlockSectionController {
   constructor(private readonly blockSectionService: BlockSectionService) {}

   @Post()
   async create(
      @Body() createScheduleDto: CreateBlockSectionDto,
   ): Promise<BlockSection> {
      return this.blockSectionService.create(createScheduleDto);
   }

   @Get()
   async findAll(): Promise<BlockSection[]> {
      return this.blockSectionService.findAll();
   }

   @Get(':id')
   async findOne(@Param('id') id: Types.ObjectId): Promise<BlockSection> {
      return this.blockSectionService.findOne(id);
   }

   @Put(':id')
   async update(
      @Param('id') id: Types.ObjectId,
      @Body() newData: Partial<CreateBlockSectionDto>,
   ): Promise<BlockSection> {
      return this.blockSectionService.update(id, newData);
   }

   @Delete(':id')
   async delete(@Param('id') id: Types.ObjectId): Promise<BlockSection> {
      return this.blockSectionService.delete(id);
   }

   @Post('seed')
   async seed(): Promise<void> {
      await this.blockSectionService.seed();
   }
}
