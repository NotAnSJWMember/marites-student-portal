import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Curriculum } from './curriculum.schema';
import { CreateCurriculumDto } from './curriculum.dto';

@Injectable()
export class CurriculumService {
   private readonly logger = new Logger(CurriculumService.name);

   constructor(
      @InjectModel(Curriculum.name) private curriculumModel: Model<Curriculum>,
   ) {}

   async create(createCurriculumDto: CreateCurriculumDto): Promise<Curriculum> {
      const newCurriculum = new this.curriculumModel(createCurriculumDto);
      return newCurriculum.save();
   }

   async findAll(): Promise<Curriculum[]> {
      return this.curriculumModel.find().exec();
   }

   async findOne(id: Types.ObjectId): Promise<Curriculum> {
      const curriculum = await this.curriculumModel.findById(id).exec();
      if (!curriculum) {
         throw new BadRequestException('Curriculum not found');
      }
      return curriculum;
   }

   async update(
      id: Types.ObjectId,
      newData: Partial<CreateCurriculumDto>,
   ): Promise<Curriculum> {
      const curriculum = await this.curriculumModel
         .findByIdAndUpdate(id, newData, { new: true })
         .exec();
      if (!curriculum) {
         throw new BadRequestException('Curriculum not found');
      }
      return curriculum;
   }

   async delete(id: Types.ObjectId): Promise<Curriculum> {
      const curriculum = await this.curriculumModel
         .findByIdAndDelete(id)
         .exec();
      if (!curriculum) {
         throw new BadRequestException('Curriculum not found');
      }
      return curriculum;
   }
}
