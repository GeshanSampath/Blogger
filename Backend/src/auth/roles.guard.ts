import {
  Injectable,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { UserRole } from '../users/users.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [
        context.getHandler(), // method
        context.getClass(),   // class
      ],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // if route doesn’t specify roles, anyone can access
    }

    const { user } = context.switchToHttp().getRequest();

    // user.role is set in JwtStrategy validate()
    return requiredRoles.includes(user.role);
  }
}