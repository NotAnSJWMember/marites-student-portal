import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
   const app = await NestFactory.create(AppModule);

   app.useGlobalInterceptors(new LoggingInterceptor());

   app.enableCors({
      origin: 'http://localhost:3000',
      methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
      credentials: true,
   });

   await app.listen(8080);
}
bootstrap();
