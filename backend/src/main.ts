import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { ValidationPipe } from '@nestjs/common';

import * as dotenv from 'dotenv';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
dotenv.config();

const env = process.env.NODE_ENV || 'development';
const originUrl = process.env[`${env.toUpperCase()}_ORIGIN_URL`];

async function bootstrap() {
   const app = await NestFactory.create<NestExpressApplication>(AppModule);

   app.useGlobalInterceptors(new LoggingInterceptor());

   app.useGlobalPipes(
      new ValidationPipe({
         transform: true,
         whitelist: true,
      }),
   );

   app.useStaticAssets(join(__dirname, '..', 'uploads'), {
      prefix: '/uploads/',
   });

   app.enableCors({
      origin: originUrl,
      methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
      credentials: true,
   });

   await app.listen(8080);
}
bootstrap();

console.log('Environment:', env);
console.log('Origin URL:', originUrl);
