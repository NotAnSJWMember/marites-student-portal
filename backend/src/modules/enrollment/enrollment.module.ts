import { forwardRef, Module } from '@nestjs/common';
import { DatabaseModule } from 'src/common/database/database.module';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { EnrollmentService } from './enrollment.service';
import { EnrollmentController } from './enrollment.controller';
import { StudentModule } from '../user/roles/student/student.module';
import { ProgramModule } from '../program/program.module';

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
      StudentModule,
      ProgramModule,
   ],
   providers: [EnrollmentService],
   controllers: [EnrollmentController],
   exports: [EnrollmentService],
})
export class EnrollmentModule {}
