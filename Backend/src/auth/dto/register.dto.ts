// src/auth/dto/register.dto.ts
import { IsEmail, IsNotEmpty, IsEnum } from 'class-validator';
import { UserRole } from '../../users/users.entity';

export class RegisterDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsEnum(UserRole, { message: 'Role must be one of super_admin, author, or user' })
  role: UserRole;
}
