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
      this.logger.log('Creating a new curriculum...');
      try {
         const newCurriculum = new this.curriculumModel(createCurriculumDto);
         const savedCurriculum = await newCurriculum.save();
         this.logger.log(
            `Curriculum created successfully with ID: ${savedCurriculum._id}`,
         );
         return savedCurriculum;
      } catch (error) {
         this.logger.error('Error creating curriculum', error.stack);
         throw new BadRequestException('Failed to create curriculum');
      }
   }

   async findAll(): Promise<Curriculum[]> {
      this.logger.log('Fetching all curriculums...');
      try {
         const curriculums = await this.curriculumModel.find().exec();
         this.logger.log(`Found ${curriculums.length} curriculums`);
         return curriculums;
      } catch (error) {
         this.logger.error('Error fetching curriculums', error.stack);
         throw new BadRequestException('Failed to fetch curriculums');
      }
   }

   async findOne(id: Types.ObjectId): Promise<Curriculum> {
      this.logger.log(`Fetching curriculum with ID: ${id}`);
      try {
         const curriculum = await this.curriculumModel.findById(id).exec();
         if (!curriculum) {
            this.logger.warn(`Curriculum with ID: ${id} not found`);
            throw new BadRequestException('Curriculum not found');
         }
         this.logger.log(`Found curriculum with ID: ${id}`);
         return curriculum;
      } catch (error) {
         this.logger.error(
            `Error fetching curriculum with ID: ${id}`,
            error.stack,
         );
         throw new BadRequestException('Failed to fetch curriculum');
      }
   }

   async update(
      id: Types.ObjectId,
      newData: Partial<CreateCurriculumDto>,
   ): Promise<Curriculum> {
      this.logger.log(`Updating curriculum with ID: ${id}`);
      try {
         const curriculum = await this.curriculumModel
            .findByIdAndUpdate(id, newData, { new: true })
            .exec();

         if (!curriculum) {
            this.logger.warn(`Curriculum with ID: ${id} not found for update`);
            throw new BadRequestException('Curriculum not found');
         }
         this.logger.log(`Curriculum with ID: ${id} updated successfully`);
         return curriculum;
      } catch (error) {
         this.logger.error(
            `Error updating curriculum with ID: ${id}`,
            error.stack,
         );
         throw new BadRequestException('Failed to update curriculum');
      }
   }

   async delete(id: Types.ObjectId): Promise<Curriculum> {
      this.logger.log(`Deleting curriculum with ID: ${id}`);
      try {
         const curriculum = await this.curriculumModel
            .findByIdAndDelete(id)
            .exec();
         if (!curriculum) {
            this.logger.warn(
               `Curriculum with ID: ${id} not found for deletion`,
            );
            throw new BadRequestException('Curriculum not found');
         }
         this.logger.log(`Curriculum with ID: ${id} deleted successfully`);
         return curriculum;
      } catch (error) {
         this.logger.error(
            `Error deleting curriculum with ID: ${id}`,
            error.stack,
         );
         throw new BadRequestException('Failed to delete curriculum');
      }
   }
}
