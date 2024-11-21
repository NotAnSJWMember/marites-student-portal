import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateFinanceDto } from './finance.dto';
import { Finance } from './finance.schema';
import { Student } from '../user/roles/student/student.schema';

@Injectable()
export class FinanceService {
   protected logger = new Logger(FinanceService.name);

   constructor(
      @InjectModel(Finance.name) private readonly financeModel: Model<Finance>,
      @InjectModel(Student.name) private readonly studentModel: Model<Student>,
   ) {}

   async createFinanceRecord(
      createFinanceDto: CreateFinanceDto,
   ): Promise<Finance> {
      const { studentId, tuitionFee, transactions } = createFinanceDto;

      // Calculate the outstanding balance considering discounts (if any)
      let outstandingBalance = tuitionFee.totalDue;
      if (tuitionFee.discounts && tuitionFee.discounts.length > 0) {
         const totalDiscount = tuitionFee.discounts.reduce(
            (sum, discount) => sum + discount.amount,
            0,
         );
         outstandingBalance = tuitionFee.totalDue - totalDiscount;
      }

      // Create finance record
      const finance = new this.financeModel({
         studentId,
         tuitionFee,
         transactions,
         outstandingBalance,
         paymentStatus: {
            status: 'unpaid',
            lastUpdated: new Date(),
         },
      });

      await finance.save();

      // Add finance record reference to student's financeRecords
      await this.studentModel.findByIdAndUpdate(studentId, {
         $push: { financeRecords: finance._id },
      });

      return finance;
   }

   async updateFinanceRecord(id: string, updateFinanceDto: CreateFinanceDto) {
      return this.financeModel
         .findByIdAndUpdate(id, updateFinanceDto, {
            new: true,
         })
         .exec();
   }

   async updatePaymentStatus(
      financeId: Types.ObjectId,
      amountPaid: number,
   ): Promise<Finance> {
      const finance = await this.financeModel.findById(financeId);
      if (!finance) throw new Error('Finance record not found');

      // Calculate new outstanding balance
      const newBalance = finance.outstandingBalance - amountPaid;

      // Update payment status
      finance.outstandingBalance = newBalance;
      finance.paymentStatus.status = newBalance <= 0 ? 'paid' : 'unpaid';
      finance.paymentStatus.lastUpdated = new Date();

      await finance.save();

      return finance;
   }

   async getFinanceRecordByStudentId(studentId: string) {
      this.logger.log(`Fetching student's finance records: ${studentId}`);

      this.logger.log(`Trying their username...`);
      let student = await this.findByUsername(studentId);

      if (!student) {
         this.logger.log('Username not found, trying their ID...');
         student = await this.findByUserId(studentId);
      }

      if (student) {
         this.logger.log(`Found student: ${student}`);
      } else {
         this.logger.warn(`Student ${studentId} not found.`);
      }

      return this.financeModel.findOne({ studentId: student.userId }).exec();
   }

   async findAll(): Promise<Finance[]> {
      return this.financeModel.find().exec();
   }

   async findOne(id: string): Promise<Finance> {
      const finance = await this.financeModel.findById(id).exec();
      if (!finance) {
         throw new NotFoundException(`Finance with ID ${id} not found`);
      }
      return finance;
   }

   async delete(id: Types.ObjectId): Promise<void> {
      const result = await this.financeModel.findByIdAndDelete(id).exec();
      if (!result) {
         throw new NotFoundException(`Finance with ID ${id} not found`);
      }
   }

   async findByUserId(userId: string): Promise<Student | null> {
      return this.studentModel.findOne({ userId }).exec();
   }

   async findByUsername(username: string): Promise<Student | null> {
      return this.studentModel.findOne({ username }).exec();
   }

   async seedTranscations(): Promise<void> {
      const transactions = [
         {
            _id: '674f372ef227c95464275dc1',
            date: '2024-10-01T08:30:00.000Z',
            method: 'Bank Transfer',
            amount: 5000,
            referenceNo: 'BT20241001',
         },
         {
            _id: '674f372ef227c95464275dc2',
            date: '2024-10-15T10:15:00.000Z',
            method: 'Cash Payment',
            amount: 10000,
            referenceNo: null,
         },
         {
            _id: '674f372ef227c95464275dc3',
            date: '2024-11-10T14:45:00.000Z',
            method: 'Online Payment',
            amount: 8000,
            referenceNo: 'OP20241110',
         },
      ];

      const newBalance = 30000 - (5000 + 10000 + 8000);

      await this.financeModel.updateOne(
         { _id: `673f48ec098cac8ac422ce7e` },
         {
            $set: {
               transactions: transactions,
               outstandingBalance: newBalance,
            },
         },
      );
   }
}
