import * as dotenv from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  dotenv.config();
  console.log('MongoDB URI:', process.env.MONGODB_URI);
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
