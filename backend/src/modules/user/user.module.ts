import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';
import { IdGenerator } from 'src/common/utils/generate-id.helper';
import { MailService } from 'src/common/services/mail/mail.service';
import { DatabaseModule } from 'src/common/database/database.module';

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
   providers: [IdGenerator, UserService, MailService],
   controllers: [UserController],
   exports: [UserService],
})
export class UserModule {}
