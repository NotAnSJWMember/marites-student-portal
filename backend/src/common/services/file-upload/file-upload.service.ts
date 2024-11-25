import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as multer from 'multer';

@Injectable()
export class FileUploadService {
   private readonly logger = new Logger(FileUploadService.name);

   private storage = multer.diskStorage({
      destination: (req, file, cb) => {
         const uploadPath = path.join(process.cwd(), 'uploads');

         if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
         }
         cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
         const fileName = `${file.originalname}-${Date.now()}-`;
         cb(null, fileName);
      },
   });

   private fileFilter(req, file, cb) {
      if (!file.mimetype.startsWith('image/')) {
         return cb(new Error('Only image files are allowed'), false);
      }
      cb(null, true);
   }

   private upload = multer({
      storage: this.storage,
      fileFilter: this.fileFilter,
   }).single('file');

   async uploadFile(req): Promise<string> {
      return new Promise((resolve, reject) => {
         this.upload(req, req.res, (error) => {
            if (error) {
               this.logger.error('File upload failed', error);
               return reject(error);
            }
            this.logger.log('File uploaded successfully');
            resolve(req.file.path);
         });
      });
   }

   async uploadUserPhoto(
      file: Express.Multer.File,
      userId?: string,
   ): Promise<string> {
      return new Promise((resolve, reject) => {
         const uploadPath = path.resolve(process.cwd(), 'uploads/images/users');

         const fileName = `${userId}-${Date.now()}-${file.originalname}`;
         const filePath = path.join(uploadPath, fileName);

         fs.writeFile(filePath, file.buffer, (err) => {
            if (err) {
               this.logger.error('Error saving file', err);
               return reject(new Error('Failed to save file: ' + err.message));
            }
            this.logger.log(`File uploaded successfully to ${filePath}`);

            const relativeFilePath = `uploads/images/users/${fileName}`;
            resolve(relativeFilePath);
         });
      });
   }

   public getStorage() {
      return this.storage;
   }
}
