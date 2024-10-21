import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateFinanceDto } from './finance.dto';
import { Finance } from './finance.schema';

@Injectable()
export class FinanceService {
   constructor(
      @InjectModel(Finance.name) private FinanceModel: Model<Finance>,
   ) {}

   async create(createFinanceDto: CreateFinanceDto): Promise<Finance> {
      const newFinance = new this.FinanceModel(createFinanceDto);
      return newFinance.save();
   }

   async findAll(): Promise<Finance[]> {
      return this.FinanceModel.find().exec();
   }

   async findOne(id: string): Promise<Finance> {
      const finance = await this.FinanceModel.findById(id).exec();
      if (!finance) {
         throw new NotFoundException(`Finance with ID ${id} not found`);
      }
      return finance;
   }

   async update(
      id: string,
      updateFinanceDto: CreateFinanceDto,
   ): Promise<Finance> {
      const updatedFinance = await this.FinanceModel.findByIdAndUpdate(
         id,
         updateFinanceDto,
         {
            new: true,
         },
      ).exec();

      if (!updatedFinance) {
         throw new NotFoundException(`Finance with ID ${id} not found`);
      }
      return updatedFinance;
   }

   async delete(id: string): Promise<void> {
      const result = await this.FinanceModel.findByIdAndDelete(id).exec();
      if (!result) {
         throw new NotFoundException(`Finance with ID ${id} not found`);
      }
   }
}
