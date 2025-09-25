// src/auth/auth.service.ts
import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../users/users.entity';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  // Ensure a super admin exists
  async ensureSuperAdmin() {
    const admin = await this.usersRepo.findOne({ where: { role: UserRole.SUPER_ADMIN } });
    if (!admin) {
      const hashedPassword = await bcrypt.hash('Admin123', 10); // default password
      const superAdmin = this.usersRepo.create({
        name: 'Super Admin',
        email: 'admin@example.com',
        password: hashedPassword,
        role: UserRole.SUPER_ADMIN,
        isApproved: true,
      });
      await this.usersRepo.save(superAdmin);
      console.log('Super Admin created: admin@example.com / Admin123');
    }
  }

  // Register new user (authors and normal users)
  async register(dto: RegisterDto) {
    if (dto.role === UserRole.SUPER_ADMIN) {
      throw new BadRequestException('Super Admin cannot be created via signup');
    }

    const existing = await this.usersRepo.findOne({ where: { email: dto.email } });
    if (existing) throw new BadRequestException('Email already exists');

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const role =
      dto.role && [UserRole.AUTHOR, UserRole.USER].includes(dto.role)
        ? dto.role
        : UserRole.USER;

    const isApproved = role === UserRole.AUTHOR ? false : true;

    const user = this.usersRepo.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      role,
      isApproved,
    });

    return this.usersRepo.save(user);
  }

  // Login
  async login(email: string, password: string) {
    const user = await this.usersRepo.findOne({ where: { email } });
    const fakeHash = '$2b$10$C/w8X0qP0cQJzQ3o0GpP6uXv3A9HgEhtK7iJ4c2/4.PYt5u7v0pQm';
    if (!user) await bcrypt.compare(password, fakeHash);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    if (user.role !== UserRole.SUPER_ADMIN && !user.isApproved) {
      throw new UnauthorizedException('Your account is not approved yet');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const payload = { id: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      role: user.role,
    };
  }
}
