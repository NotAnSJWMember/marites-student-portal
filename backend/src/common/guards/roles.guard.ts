import {
   Injectable,
   CanActivate,
   ExecutionContext,
   ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RolesGuard implements CanActivate {
   constructor(
      private reflector: Reflector,
      private jwtService: JwtService,
   ) {}

   canActivate(context: ExecutionContext): boolean {
      const requiredRoles = this.reflector.getAllAndOverride<string[]>(
         'roles',
         [context.getHandler(), context.getClass()],
      );

      if (!requiredRoles) {
         return true;
      }

      const request = context.switchToHttp().getRequest();
      const token = request.headers['authorization']?.split(' ')[1];

      if (!token) {
         throw new ForbiddenException('No token provided');
      }

      try {
         const payload = this.jwtService.verify(token);
         const userRole = payload.role;

         return requiredRoles.includes(userRole);
      } catch (error) {
         console.error('Token verification error:', error);
         throw new ForbiddenException(
            'Invalid token or insufficient permissions',
         );
      }
   }
}
