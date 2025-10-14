import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User, UserRole } from '../users/users.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  // Ensure a Super Admin exists at startup
  async ensureSuperAdmin() {
    const email = 'admin@example.com';
    const existing = await this.userRepo.findOne({ where: { email } });
    if (existing) return;

    const hashed = await bcrypt.hash('admin123', 10);
    const admin = this.userRepo.create({
      name: 'Super Admin',
      email,
      password: hashed,
      role: UserRole.SUPER_ADMIN,
      isApproved: true,
    });

    await this.userRepo.save(admin);
    console.log('Super Admin created');
  }

  // Register a new user
  async register(dto: RegisterDto): Promise<User> {
    const existing = await this.userRepo.findOne({ where: { email: dto.email } });
    if (existing) throw new BadRequestException('Email already exists');

    const hash = await bcrypt.hash(dto.password, 10);
    const role =
      dto.role?.toLowerCase() === 'author' ? UserRole.AUTHOR : UserRole.USER;

    const user = this.userRepo.create({
      ...dto,
      password: hash,
      role,
      isApproved: role === UserRole.USER,
    });

    return await this.userRepo.save(user);
  }

  // Login existing user
  async login(dto: LoginDto) {
    const user = await this.userRepo.findOne({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    if (user.role === UserRole.AUTHOR && !user.isApproved) {
      throw new UnauthorizedException(
        'Your account is pending approval by a Super Admin.',
      );
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken, role: user.role };
  }

  // Verify email before password reset (always return 200)
  async verifyEmail(email: string) {
    const user = await this.userRepo.findOne({ where: { email } });
    return {
      success: !!user,
      message: user
        ? 'Email verified successfully'
        : 'Email not found',
    };
  }

  // Reset password directly using email
  async resetPassword(email: string, newPassword: string) {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) {
      // Optional: still return 200 but with a message
      return { message: 'If this email exists, password has been reset' };
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await this.userRepo.save(user);

    return { message: 'Password reset successful' };
  }
}
