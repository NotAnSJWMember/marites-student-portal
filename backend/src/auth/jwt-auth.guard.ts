import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
   constructor(private jwtService: JwtService) {}

   canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest();
      const token = request.headers['authorization']?.split(' ')[1];
      if (!token) return false;

      try {
         const payload = this.jwtService.verify(token);
         request.user = payload;
         return true;
      } catch (error) {
         console.error('Token validation error:', error);
         return false;
      }
   }
}
