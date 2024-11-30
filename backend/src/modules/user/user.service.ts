import {
   ConflictException,
   HttpException,
   HttpStatus,
   Injectable,
   Logger,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { IdGenerator } from 'src/common/utils/generate-id.helper';
import { Connection, Model, Types } from 'mongoose';
import { CreateUserDto } from './user.dto';

import * as bcrypt from 'bcrypt';
import { Student } from './roles/student/student.schema';
import { Instructor } from './roles/instructor/instructor.schema';
import { FileUploadService } from 'src/common/services/file-upload/file-upload.service';

@Injectable()
export class UserService {
   protected logger = new Logger(UserService.name);

   constructor(
      @InjectConnection() private readonly connection: Connection,
      @InjectModel(User.name) private userModel: Model<User>,
      @InjectModel(Student.name) private studentModel: Model<Student>,
      @InjectModel(Instructor.name) private instructorModel: Model<Instructor>,
      protected readonly fileUploadService: FileUploadService,
      private idGenerator: IdGenerator,
   ) {}

   async create(
      createUserDto: CreateUserDto,
      file: Express.Multer.File,
   ): Promise<User> {
      this.logger.log('Creating new user...');

      try {
         createUserDto.userId = await this.idGenerator.generateId();
         this.logger.log(`Generated user id: ${createUserDto.userId}`);

         const hashedPassword = await this.hashPassword(createUserDto.password);

         if (file) {
            const filePath = await this.fileUploadService.uploadUserPhoto(
               file,
               createUserDto.userId,
            );
            createUserDto.userPhoto = filePath;
            this.logger.log(`Photo saved at: ${filePath}`);
         } else {
            this.logger.warn(`No photo uploaded for user.`);
         }

         const newUser = new this.userModel({
            ...createUserDto,
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

   async update(
      userId: string,
      createUserDto: CreateUserDto,
      file: Express.Multer.File,
   ): Promise<{ message: string; updatedUser?: User | null }> {
      this.logger.log(`Updating user with ID: ${userId}`);

      try {
         this.logger.log('Initial payload:', createUserDto);

         let existingUser = await this.userModel.findOne({ userId }).exec();
         if (!existingUser) {
            this.logger.warn(`No user found with ID: ${userId} to update.`);
            return {
               message: `No user found with ID: ${userId} to update.`,
               updatedUser: null,
            };
         }
         this.logger.log('Existing user:', existingUser);

         if (existingUser.role === 'student') {
            existingUser = await this.studentModel.findOne({ userId }).exec();
         } else if (existingUser.role === 'instructor') {
            existingUser = await this.instructorModel
               .findOne({ userId })
               .exec();
         }

         this.logger.log('Existing user:', existingUser);

         if (existingUser && file) {
            const filePath = await this.fileUploadService.uploadUserPhoto(
               file,
               userId,
            );
            createUserDto.userPhoto = filePath;
            this.logger.log(`Photo saved at: ${filePath}`);
         } else {
            this.logger.warn(`No photo uploaded for user.`);
         }

         const updatedFields: Partial<CreateUserDto> = {};
         Object.keys(createUserDto).forEach((key) => {
            const newValue = createUserDto[key];
            const oldValue = existingUser[key];

            if (key === 'birthDate') {
               if (
                  new Date(newValue).getTime() === new Date(oldValue).getTime()
               ) {
                  this.logger.warn(`Field ${key} is unchanged.`);
                  return;
               }
            } else if (
               newValue === null ||
               newValue === undefined ||
               newValue === '' ||
               newValue === oldValue
            ) {
               this.logger.warn(
                  `Field ${key} is ${newValue === oldValue ? 'unchanged' : 'invalid'}.`,
               );
               return;
            }

            updatedFields[key] = newValue;
         });

         if (Object.keys(updatedFields).length === 0 && !file) {
            this.logger.warn('No updates were made to the user.');
            return {
               message:
                  'No changes were made as all fields are unchanged or invalid.',
               updatedUser: null,
            };
         }

         if (updatedFields.password) {
            this.logger.log('Hashing new password..');
            updatedFields.password = await this.hashPassword(
               updatedFields.password,
            );
         }

         this.logger.log('Filtered payload: ', updatedFields);

         const updatedUser = await this.userModel
            .findOneAndUpdate({ userId }, updatedFields, { new: true })
            .exec();

         await Promise.all([
            this.studentModel
               .findOneAndUpdate({ userId }, updatedFields, { new: true })
               .exec(),
            this.instructorModel
               .findOneAndUpdate({ userId }, updatedFields, { new: true })
               .exec(),
         ]);

         this.logger.log(`Successfully updated user: ${updatedUser}`);
         return {
            message: `Successfully updated the user ${updatedUser.firstName}`,
            updatedUser,
         };
      } catch (error) {
         this.logger.error(`Failed to update user with ID: ${userId}`, error);
         throw new HttpException(
            'Failed to update user',
            HttpStatus.INTERNAL_SERVER_ERROR,
         );
      }
   }

   async delete(
      userId: string,
   ): Promise<{ message: string; deletedUser?: User | null }> {
      this.logger.log(`Deleting user with ID: ${userId}`);

      const deletedUser = await this.userModel
         .findOneAndDelete({ userId })
         .exec();

      if (deletedUser) {
         this.logger.log(
            `Successfully deleted user from userModel: ${deletedUser}`,
         );

         await this.studentModel.findOneAndDelete({ userId }).exec();
         await this.instructorModel.findOneAndDelete({ userId }).exec();

         return {
            message: `Successfully deleted the user ${deletedUser.firstName}`,
            deletedUser,
         };
      } else {
         const deletedStudent = await this.studentModel
            .findOneAndDelete({ userId })
            .exec();
         const deletedInstructor = await this.instructorModel
            .findOneAndDelete({ userId })
            .exec();

         if (deletedStudent || deletedInstructor) {
            this.logger.log(
               `Successfully deleted user from ${deletedStudent ? 'studentModel' : 'instructorModel'}.`,
            );
            return {
               message: `Successfully deleted the user from ${deletedStudent ? 'studentModel' : 'instructorModel'}`,
               deletedUser: deletedStudent || deletedInstructor,
            };
         } else {
            this.logger.warn(`No user found with ID: ${userId} to delete.`);
            return {
               message: `No user found with ID: ${userId} to delete.`,
               deletedUser: null,
            };
         }
      }
   }

   async batchDelete(userIds: Types.ObjectId[]): Promise<any> {
      const session = await this.connection.startSession();
      session.startTransaction();

      this.logger.log(`Deleting ${userIds.length} users...`);

      try {
         await this.userModel.deleteMany(
            { _id: { $in: userIds } },
            { session },
         );

         this.logger.log('Successfully deleted all users requested.');
         await session.commitTransaction();

         return { message: 'Successfully deleted users.' };
      } catch (error) {
         this.logger.error(`Batch delete failed: ${error.message}`);
         await session.abortTransaction();

         return { message: 'Could not delete users.' };
      } finally {
         session.endSession();
      }
   }

   async findAll(): Promise<User[]> {
      this.logger.log('Fetching all users...');
      const users = await this.userModel.find().exec();
      this.logger.log(`Fetched ${users.length} users.`);
      return users;
   }

   async findOne(userId: string): Promise<User> {
      this.logger.log(`Fetching user: ${userId}`);

      this.logger.log(`Trying their username...`);
      let user = await this.findByUsername(userId);

      if (!user) {
         this.logger.log('Username not found, trying their ID...');
         user = await this.findByUserId(userId);
      }

      if (user) {
         this.logger.log(`Found user: ${user}`);
      } else {
         this.logger.warn(`User ${userId} not found.`);
      }

      return user;
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

   async findByUsername(username: string): Promise<User> {
      this.logger.log(`Searching for user with username: ${username}`);
      const user = await this.userModel.findOne({ username }).exec();
      if (!user) {
         this.logger.warn(`No user found with username: ${username}`);
      }
      return user;
   }

   async findByUserId(userId: string): Promise<User> {
      this.logger.log(`Searching for user with user id: ${userId}`);
      const user = await this.userModel.findOne({ userId }).exec();
      if (!user) {
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

   async operationRestoreMyself() {
      await this.userModel.create({
         _id: new Types.ObjectId('67095a953d179c4cb977e090'),
         userId: '832269',
         firstName: 'Mikhaille',
         lastName: 'Bacay',
         email: 'kaiserlaconfiture@gmail.com',
         phoneNum: '9569372583',
         birthDate: new Date('2024-10-01T00:00:00.000Z'),
         sex: 'Male',
         programme: 'BSIT',
         year: 1,
         username: 'raneac',
         password:
            '$2a$12$VlmU.ScvUV3Q5thXtMlFa.agvyGNUoym0qFqGdXd/B1.Q2uSklOBi',
         role: 'admin',
         createdAt: new Date('2024-10-11T16:50:22.488Z'),
         updatedAt: new Date('2024-11-28T10:24:49.086Z'),
         __v: 946656000000,
         lastActive: new Date('2024-11-28T10:21:04.264Z'),
         gender: 'Female',
         userPhoto:
            'uploads/images/users/832269-1732779214108-249d8644ed61ca978c1411ea75f72042.jpg',
      });
   }
}
