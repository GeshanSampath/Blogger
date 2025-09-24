import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './users.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  async createUser(email: string, password: string, role: UserRole = UserRole.USER) {
    const existing = await this.usersRepo.findOne({ where: { email } });
    if (existing) throw new BadRequestException('User already exists');

    const user = this.usersRepo.create({
      email,
      password,
      role,
      isApproved: role === UserRole.AUTHOR ? false : true,
    });

    return this.usersRepo.save(user);
  }

  async findByEmail(email: string) {
    return this.usersRepo.findOne({ where: { email } });
  }

  async findAllAuthorsPendingApproval() {
    return this.usersRepo.find({ where: { role: UserRole.AUTHOR, isApproved: false } });
  }

  async approveAuthor(userId: number) {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    user.isApproved = true;
    return this.usersRepo.save(user);
  }
}
