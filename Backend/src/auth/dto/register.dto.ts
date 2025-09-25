import { IsEmail, IsNotEmpty, MinLength, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { UserRole } from '../../users/users.entity';

export class RegisterDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsOptional()
  @IsEnum(UserRole, { message: 'Role must be either super_admin, author, or user' })
  role?: UserRole;

  @IsOptional()
  @IsBoolean()
  isApproved?: boolean;  // 👈 for authors, defaults to false until super admin approves
}
