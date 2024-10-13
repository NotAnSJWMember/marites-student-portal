import {
   CallHandler,
   ExecutionContext,
   Injectable,
   NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
   intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const request = context.switchToHttp().getRequest();
      const { method, url } = request;
      const start = Date.now();

      console.log(`Incoming Request: ${method} ${url}`);

      return next.handle().pipe(
         tap(() => {
            const duration = Date.now() - start;
            console.log(`Response for ${method} ${url} - ${duration}ms`);
         }),
      );
   }
}
