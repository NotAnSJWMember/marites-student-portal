import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { FinanceService } from './finance.service';
import { CreateFinanceDto } from './finance.dto';
import { Finance } from './finance.schema';

@Controller('finance')
export class FinanceController {
   constructor(private readonly financeService: FinanceService) {}

   @Post()
   async createFinanceRecord(@Body() createFinanceDto: CreateFinanceDto) {
      return this.financeService.createFinanceRecord(createFinanceDto);
   }

   @Get()
   async findAll(): Promise<Finance[]> {
      return this.financeService.findAll();
   }

   @Get(':studentId')
   async getFinanceRecord(@Param('studentId') studentId: string) {
      return this.financeService.getFinanceRecordByStudentId(studentId);
   }

   @Put(':id')
   async updateFinanceRecord(
      @Param('id') id: string,
      @Body() updateFinanceDto: CreateFinanceDto,
   ) {
      return this.financeService.updateFinanceRecord(id, updateFinanceDto);
   }

   @Post('/seed')
   async seed() {
      return this.financeService.seedTranscations();
   }
}
