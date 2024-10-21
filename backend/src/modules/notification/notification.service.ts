import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateNotificationDto } from './notification.dto';
import { Notification } from './notification.schema';

@Injectable()
export class NotificationService {
   constructor(
      @InjectModel(Notification.name)
      private NotificationModel: Model<Notification>,
   ) {}

   async create(
      createNotificationDto: CreateNotificationDto,
   ): Promise<Notification> {
      const newNotification = new this.NotificationModel(createNotificationDto);
      return newNotification.save();
   }

   async findAll(): Promise<Notification[]> {
      return this.NotificationModel.find().exec();
   }

   async findOne(id: string): Promise<Notification> {
      const Notification = await this.NotificationModel.findById(id).exec();
      if (!Notification) {
         throw new NotFoundException(`Notification with ID ${id} not found`);
      }
      return Notification;
   }

   async update(
      id: string,
      updateNotificationDto: CreateNotificationDto,
   ): Promise<Notification> {
      const updatedNotification =
         await this.NotificationModel.findByIdAndUpdate(
            id,
            updateNotificationDto,
            {
               new: true,
            },
         ).exec();

      if (!updatedNotification) {
         throw new NotFoundException(`Notification with ID ${id} not found`);
      }
      return updatedNotification;
   }

   async delete(id: string): Promise<void> {
      const result = await this.NotificationModel.findByIdAndDelete(id).exec();
      if (!result) {
         throw new NotFoundException(`Notification with ID ${id} not found`);
      }
   }
}
