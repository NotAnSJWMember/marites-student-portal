import { forwardRef, Module } from '@nestjs/common';
import { DatabaseModule } from 'src/common/database/database.module';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { InstructorService } from './instructor.service';
import { InstructorController } from './instructor.controller';

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
   providers: [InstructorService],
   controllers: [InstructorController],
   exports: [InstructorService],
})
export class InstructorModule {}
