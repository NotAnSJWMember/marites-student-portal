import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
dotenv.config();

const env = process.env.NODE_ENV || 'development';
const originUrl = process.env[`${env.toUpperCase()}_ORIGIN_URL`];

async function bootstrap() {
   const app = await NestFactory.create(AppModule);

   app.useGlobalInterceptors(new LoggingInterceptor());

   app.useGlobalPipes(
      new ValidationPipe({
         transform: true,
         whitelist: true,
      }),
   );

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
