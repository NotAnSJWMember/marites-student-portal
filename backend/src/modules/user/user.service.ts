import {
   ConflictException,
   HttpException,
   HttpStatus,
   Injectable,
   Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { IdGenerator } from 'src/common/utils/generate-id.helper';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
   private readonly logger = new Logger(UserService.name);

   constructor(
      @InjectModel(User.name) private userModel: Model<User>,
      private readonly idGenerator: IdGenerator,
   ) {}

   async create(userData: Partial<User>): Promise<User> {
      this.logger.log('Creating new user...');

      try {
         userData.userId = await this.idGenerator.generateId();
         this.logger.log(`Generated user id: ${userData.userId}`);

         const hashedPassword = await this.hashPassword(userData.password);

         const newUser = new this.userModel({
            ...userData,
            password: hashedPassword,
         });

         await newUser.save();
         this.logger.log('User created successfully:', newUser);
         return newUser;
      } catch (error) {
         this.logger.error('Failed to create user:', error);

         if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            const value = error.keyValue[field];
            throw new ConflictException(
               `The ${field} "${value}" already exists.`,
            );
         }

         throw new HttpException(
            'Failed to create user:',
            HttpStatus.INTERNAL_SERVER_ERROR,
         );
      }
   }

   async hashPassword(password: string): Promise<string> {
      const saltRounds = 10;
      try {
         this.logger.log('Hashing password...');
         const hashedPassword = await bcrypt.hash(password, saltRounds);
         this.logger.log('Password hashed successfully.');
         return hashedPassword;
      } catch (error) {
         this.logger.error('Error hashing password:', error);
         throw new HttpException(
            'Password hashing failed',
            HttpStatus.INTERNAL_SERVER_ERROR,
         );
      }
   }

   async comparePassword(
      plainPassword: string,
      hashedPassword: string,
   ): Promise<boolean> {
      return bcrypt.compare(plainPassword, hashedPassword);
   }

   async findAll(): Promise<User[]> {
      this.logger.log('Fetching all users...');
      const users = await this.userModel.find().exec();
      this.logger.log(`Fetched ${users.length} users.`);
      return users;
   }

   async findOne(userId: string): Promise<User> {
      this.logger.log(`Fetching user with ID: ${userId}`);
      const user = await this.userModel.findOne({ userId }).exec();
      if (user) {
         this.logger.log(`Found user: ${user}`);
      } else {
         this.logger.warn(`User with ID: ${userId} not found.`);
      }
      return user;
   }

   async findByUsername(username: string): Promise<User> {
      this.logger.log(`Searching for user with username: ${username}`);
      const user = await this.userModel.findOne({ username }).exec();
      if (user) {
         this.logger.log(`Found user: ${user}`);
      } else {
         this.logger.warn(`No user found with username: ${username}`);
      }
      return user;
   }

   async findByUserId(userId: string): Promise<User> {
      this.logger.log(`Searching for user with user id: ${userId}`);
      const user = await this.userModel.findOne({ userId }).exec();
      if (user) {
         this.logger.log(`Found user: ${user}`);
      } else {
         this.logger.warn(`No user found with user id: ${userId}`);
      }
      return user;
   }

   async updatePassword(userId: string, newPassword: string): Promise<void> {
      this.logger.log(`Updating password for user with ID: ${userId}`);
      const hashedPassword = await this.hashPassword(newPassword);

      try {
         await this.userModel.updateOne(
            { userId },
            { password: hashedPassword },
         );
         this.logger.log(
            `Password updated successfully for user ID: ${userId}`,
         );
      } catch (error) {
         this.logger.error(
            `Failed to update password for user ID: ${userId}`,
            error,
         );
         throw new HttpException(
            'Failed to update password',
            HttpStatus.INTERNAL_SERVER_ERROR,
         );
      }
   }

   async update(userId: string, userData: Partial<User>): Promise<User | null> {
      this.logger.log(`Updating user with ID: ${userId}`);
      const updatedUser = await this.userModel
         .findOneAndUpdate({ userId }, userData, { new: true })
         .exec();

      if (updatedUser) {
         this.logger.log(`Successfully updated user: ${updatedUser}`);
      } else {
         this.logger.warn(`User with ID: ${userId} not found for update.`);
      }

      return updatedUser || null;
   }

   async delete(userId: string): Promise<User> {
      this.logger.log(`Deleting user with ID: ${userId}`);
      const deletedUser = await this.userModel
         .findOneAndDelete({ userId })
         .exec();

      if (deletedUser) {
         this.logger.log(`Successfully deleted user: ${deletedUser}`);
      } else {
         this.logger.warn(`No user found with ID: ${userId} to delete.`);
      }

      return deletedUser || null;
   }
}
