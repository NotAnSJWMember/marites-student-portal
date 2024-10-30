import {
   Body,
   Controller,
   Delete,
   Get,
   Param,
   Post,
   Put,
} from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from './schedule.dto';
import { Schedule } from './schedule.schema';
import { Types } from 'mongoose';

@Controller('schedule')
export class ScheduleController {
   constructor(private readonly scheduleService: ScheduleService) {}

   @Post()
   async create(
      @Body() createScheduleDto: CreateScheduleDto,
   ): Promise<Schedule> {
      return this.scheduleService.create(createScheduleDto);
   }

   @Get()
   async findAll(): Promise<Schedule[]> {
      return this.scheduleService.findAll();
   }

   @Get(':id')
   async findOne(@Param('id') id: Types.ObjectId): Promise<Schedule> {
      return this.scheduleService.findOne(id);
   }

   @Put(':id')
   async update(
      @Param('id') id: Types.ObjectId,
      @Body() newData: Partial<CreateScheduleDto>,
   ): Promise<Schedule> {
      return this.scheduleService.update(id, newData);
   }

   @Delete(':id')
   async delete(@Param('id') id: Types.ObjectId): Promise<Schedule> {
      return this.scheduleService.delete(id);
   }
}
