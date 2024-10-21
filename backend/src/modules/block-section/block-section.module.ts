import { forwardRef, Module } from '@nestjs/common';
import { BlockSectionService } from './block-section.service';
import { BlockSectionController } from './block-section.controller';
import { DatabaseModule } from 'src/common/database/database.module';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

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
   providers: [BlockSectionService],
   controllers: [BlockSectionController],
   exports: [BlockSectionService],
})
export class BlockSectionModule {}
