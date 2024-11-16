import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
   const app = await NestFactory.create(AppModule);

   // Get the environment and origin URL based on the environment
   const env = process.env.NODE_ENV || 'development';
   const originUrl = process.env[`${env.toUpperCase()}_ORIGIN_URL`];

   // Log environment and origin URL
   console.log(`Running in ${env} environment`);
   console.log(`Using origin URL: ${originUrl}`);

   // Enable logging and validation pipes
   app.useGlobalInterceptors(new LoggingInterceptor());

   app.useGlobalPipes(
      new ValidationPipe({
         transform: true,
         whitelist: true,
      }),
   );

   // Configure CORS
   app.enableCors({
      origin: originUrl,
      methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
      credentials: true,
   });

   await app.listen(8080);
}
bootstrap();
