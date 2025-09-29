// src/auth/auth.service.ts
import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../users/users.entity';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  // Ensure default Super Admin exists
  async ensureSuperAdmin() {
    const email = 'admin@example.com';
    const existing = await this.userRepo.findOne({ where: { email } });
    if (existing) return;

    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = this.userRepo.create({
      name: 'Super Admin',
      email,
      password: hashedPassword,
      role: UserRole.SUPER_ADMIN,
      isApproved: true,
    });

    await this.userRepo.save(admin);
    console.log('✅ Super Admin created successfully');
  }

  async register(dto: RegisterDto): Promise<User> {
    const existing = await this.userRepo.findOne({ where: { email: dto.email } });
    if (existing) throw new BadRequestException('Email already exists');

    // Normalize role string
    const roleInput = dto.role?.toString().trim().toLowerCase();
    let roleEnum: UserRole;
    switch (roleInput) {
      case 'super_admin':
        roleEnum = UserRole.SUPER_ADMIN;
        break;
      case 'author':
        roleEnum = UserRole.AUTHOR;
        break;
      default:
        roleEnum = UserRole.USER;
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = this.userRepo.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      role: roleEnum,
      isApproved: false,
    });

    return this.userRepo.save(user);
  }

  async login(dto: LoginDto): Promise<{ accessToken: string; role: UserRole }> {
    const user = await this.userRepo.findOne({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const payload = { userId: user.id, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken, role: user.role };
  }
}
