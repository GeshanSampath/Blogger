// src/dashboard/dashboard.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../users/users.entity';
import { Blog, BlogStatus } from '../blogs/blog.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Blog)
    private readonly blogRepo: Repository<Blog>,
  ) {}

  async getUsersCount() {
    const users = await this.userRepo.count({ where: { role: UserRole.USER } });
    const authors = await this.userRepo.count({ where: { role: UserRole.AUTHOR } });
    const pendingAuthors = await this.userRepo.count({
      where: { role: UserRole.AUTHOR, isApproved: false },
    });
    return { users, authors, pendingAuthors };
  }

  async getBlogsCount() {
    const totalBlogs = await this.blogRepo.count();
    const activeBlogs = await this.blogRepo.count({ where: { status: BlogStatus.APPROVED } });
    const pendingBlogs = totalBlogs - activeBlogs;
    return { totalBlogs, activeBlogs, pendingBlogs };
  }

  async getBlogTrends() {
    try {
      // Works for MySQL
      const query = this.blogRepo
        .createQueryBuilder('blog')
        .select("DATE_FORMAT(blog.createdAt, '%b %Y')", 'month')
        .addSelect('COUNT(blog.id)', 'blogs')
        .groupBy("DATE_FORMAT(blog.createdAt, '%b %Y')")
        .orderBy('MIN(blog.createdAt)', 'ASC');

      const trends = await query.getRawMany();

      return trends.map((t) => ({ month: t.month, blogs: Number(t.blogs) }));
    } catch (err) {
      console.error('Error fetching blog trends:', err);
      throw err;
    }
  }
}
