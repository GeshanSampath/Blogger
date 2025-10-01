import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../users/users.entity';

// KEY that'll be attached to routes
export const ROLES_KEY = 'roles';

// Decorator you can use with @Roles(UserRole.SUPER_ADMIN)
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);