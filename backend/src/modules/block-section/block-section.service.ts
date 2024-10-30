import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BlockSection } from './block-section.schema';
import { Model, Types } from 'mongoose';
import { CreateBlockSectionDto } from './block-section.dto';

@Injectable()
export class BlockSectionService {
   constructor(
      @InjectModel(BlockSection.name)
      private BlockSectionModel: Model<BlockSection>,
   ) {}

   async create(
      createBlockSectionDto: CreateBlockSectionDto,
   ): Promise<BlockSection> {
      const newBlockSection = new this.BlockSectionModel(createBlockSectionDto);
      return newBlockSection.save();
   }

   async findAll(): Promise<BlockSection[]> {
      return this.BlockSectionModel.find().exec();
   }

   async findOne(id: Types.ObjectId): Promise<BlockSection> {
      return this.BlockSectionModel.findById(id).exec();
   }

   async update(
      id: Types.ObjectId,
      newData: Partial<CreateBlockSectionDto>,
   ): Promise<BlockSection> {
      return this.BlockSectionModel.findByIdAndUpdate(id, newData, {
         new: true,
      }).exec();
   }

   async delete(id: Types.ObjectId): Promise<BlockSection> {
      return this.BlockSectionModel.findByIdAndDelete(id).exec();
   }

   async seed(): Promise<void> {
      const dummyBlocks: CreateBlockSectionDto[] = [
         {
            blockId: new Types.ObjectId(),
            blockDescription: 'Section A',
            blockActive: true,
         },
         {
            blockId: new Types.ObjectId(),
            blockDescription: 'Section B',
            blockActive: true,
         },
         {
            blockId: new Types.ObjectId(),
            blockDescription: 'Section C',
            blockActive: false,
         },
         {
            blockId: new Types.ObjectId(),
            blockDescription: 'Section D',
            blockActive: true,
         },
         {
            blockId: new Types.ObjectId(),
            blockDescription: 'Section E',
            blockActive: true,
         },
      ];

      try {
         await this.BlockSectionModel.insertMany(dummyBlocks);
         console.log('Dummy blocks inserted successfully');
      } catch (error) {
         console.error('Error inserting dummy blocks:', error);
      }
   }
}
