// src/users/users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  async findAllAuthorsPendingApproval(): Promise<User[]> {
    return this.usersRepo.find({
      where: { role: UserRole.AUTHOR, isApproved: false },
    });
  }

  async approveAuthor(id: number): Promise<User> {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    user.isApproved = true;
    return this.usersRepo.save(user);
  }
}
