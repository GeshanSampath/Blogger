import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { User, UserRole } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  //  Get all users except SUPER_ADMIN
  async findAll(): Promise<User[]> {
    return this.usersRepo.find({ where: { role: Not(UserRole.SUPER_ADMIN) } });
  }

  //  Only regular users
  async findOnlyUsers(): Promise<User[]> {
    return this.usersRepo.find({ where: { role: UserRole.USER } });
  }

  //  Only authors
  async findOnlyAuthors(): Promise<User[]> {
    return this.usersRepo.find({ where: { role: UserRole.AUTHOR } });
  }

  //  Only pending authors
  async findAllAuthorsPendingApproval(): Promise<User[]> {
    return this.usersRepo.find({ where: { role: UserRole.AUTHOR, isApproved: false } });
  }

  async approveAuthor(id: number): Promise<User> {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    user.isApproved = true;
    return this.usersRepo.save(user);
  }

  async rejectAuthor(id: number): Promise<{ message: string }> {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    await this.usersRepo.remove(user);
    return { message: `Author ${id} has been rejected and removed` };
  }
}
