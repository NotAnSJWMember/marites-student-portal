import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from 'src/common/database/database.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { UserService } from '../../user.service';
import { CurriculumService } from 'src/modules/curriculum/curriculum.service';
import { IdGenerator } from 'src/common/utils/generate-id.helper';
import { FileUploadService } from 'src/common/services/file-upload/file-upload.service';

@Module({
   imports: [
      DatabaseModule,
      forwardRef(() => AuthModule),
      JwtModule.registerAsync({
         useFactory: () => ({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '1h' },
         }),
      }),
   ],
   providers: [
      UserService,
      StudentService,
      CurriculumService,
      FileUploadService,
      IdGenerator,
   ],
   controllers: [StudentController],
   exports: [StudentService],
})
export class StudentModule {}
