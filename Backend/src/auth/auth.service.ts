import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
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
    console.log('✅ Super Admin created');
  }

  async register(dto: RegisterDto): Promise<User> {
    const existing = await this.userRepo.findOne({ where: { email: dto.email } });
    if (existing) throw new BadRequestException('Email exists');

    const hash = await bcrypt.hash(dto.password, 10);
    const role = dto.role?.toLowerCase() === 'author' ? UserRole.AUTHOR : UserRole.USER;

    const user = this.userRepo.create({ ...dto, password: hash, role });
    return this.userRepo.save(user);
  }

  async login(dto: LoginDto) {
    const user = await this.userRepo.findOne({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    if (!(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken, role: user.role };
  }
}