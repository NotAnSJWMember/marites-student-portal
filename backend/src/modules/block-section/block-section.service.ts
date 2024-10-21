import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BlockSection } from './block-section.schema';
import { Model } from 'mongoose';
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

   async findOne(id: string): Promise<BlockSection> {
      return this.BlockSectionModel.findById(id).exec();
   }

   async update(id: string): Promise<BlockSection> {
      return this.BlockSectionModel.findByIdAndUpdate(id, { new: true }).exec();
   }

   async delete(id: string): Promise<BlockSection> {
      return this.BlockSectionModel.findByIdAndDelete(id).exec();
   }
}
