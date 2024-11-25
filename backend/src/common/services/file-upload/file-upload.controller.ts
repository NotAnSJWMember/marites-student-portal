import {
   Controller,
   Post,
   UploadedFile,
   UseInterceptors,
   Logger,
   BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from './file-upload.service';
import * as fs from 'fs';
import * as path from 'path';
import * as multer from 'multer';

@Controller('upload')
export class FileUploadController {
   private readonly logger = new Logger(FileUploadController.name);

   constructor(private readonly fileUploadService: FileUploadService) {}

   @Post('image')
   @UseInterceptors(
      FileInterceptor('file', {
         storage: multer.diskStorage({
            destination: (req, file, cb) => {
               const uploadPath = path.join(__dirname, '../../uploads');
               if (!fs.existsSync(uploadPath)) {
                  fs.mkdirSync(uploadPath, { recursive: true });
               }
               cb(null, uploadPath);
            },
            filename: (req, file, cb) => {
               const fileName = `${Date.now()}-${file.originalname}`;
               cb(null, fileName);
            },
         }),
         fileFilter: (req, file, cb) => {
            if (!file.mimetype.startsWith('image/')) {
               return cb(
                  new BadRequestException('Only image files are allowed'),
                  false,
               );
            }
            cb(null, true);
         },
         limits: { fileSize: 2 * 1024 * 1024 },
      }),
   )
   async uploadImage(@UploadedFile() file: Express.Multer.File) {
      try {
         if (!file) {
            throw new BadRequestException('No file uploaded');
         }

         const filePath = await this.fileUploadService.uploadUserPhoto(file);
         return { filePath: `/uploads/${filePath.split('/').pop()}` };
      } catch (error) {
         this.logger.error('Image upload failed:', error);
         throw new BadRequestException('Failed to upload image');
      }
   }

   // Upload document route
   @Post('document')
   @UseInterceptors(
      FileInterceptor('file', {
         storage: multer.diskStorage({
            destination: (req, file, cb) => {
               const uploadPath = path.join(__dirname, '../../uploads');
               if (!fs.existsSync(uploadPath)) {
                  fs.mkdirSync(uploadPath, { recursive: true });
               }
               cb(null, uploadPath);
            },
            filename: (req, file, cb) => {
               const fileName = `${Date.now()}-${file.originalname}`;
               cb(null, fileName);
            },
         }),
         fileFilter: (req, file, cb) => {
            if (!file.mimetype.startsWith('application/')) {
               return cb(
                  new BadRequestException('Only document files are allowed'),
                  false,
               );
            }
            cb(null, true);
         },
         limits: { fileSize: 5 * 1024 * 1024 },
      }),
   )
   async uploadDocument(@UploadedFile() file: Express.Multer.File) {
      try {
         if (!file) {
            throw new BadRequestException('No file uploaded');
         }

         const filePath = await this.fileUploadService.uploadFile(file);
         return { filePath: `/uploads/${filePath.split('/').pop()}` };
      } catch (error) {
         this.logger.error('Document upload failed:', error);
         throw new BadRequestException('Failed to upload document');
      }
   }
}
