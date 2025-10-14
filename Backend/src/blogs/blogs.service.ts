import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Blog, BlogStatus } from './blog.entity';
import { CreateBlogDto } from './dto/create-blog.dto';
import { User } from '../users/users.entity';

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(Blog) private readonly blogsRepo: Repository<Blog>,
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
  ) {}

  // Public: approved blogs
  async findAll(): Promise<Blog[]> {
    return this.blogsRepo.find({
      where: { status: BlogStatus.APPROVED },
      relations: ['author'],
      order: { createdAt: 'DESC' },
    });
  }

  // 🔍 Search blogs by keyword (title or content)
  async searchByKeyword(keyword: string): Promise<Blog[]> {
    if (!keyword || keyword.trim() === '') {
      return this.findAll();
    }

    return this.blogsRepo.find({
      where: [
        { title: Like(`%${keyword}%`), status: BlogStatus.APPROVED },
        { content: Like(`%${keyword}%`), status: BlogStatus.APPROVED },
      ],
      relations: ['author'],
      order: { createdAt: 'DESC' },
    });
  }

  // Trending blogs (top viewed)
  async findTopByViews(limit: number): Promise<Blog[]> {
    return this.blogsRepo.find({
      where: { status: BlogStatus.APPROVED },
      order: { views: 'DESC' },
      take: limit,
      relations: ['author'],
    });
  }

  // Increment views
  async incrementViews(id: number): Promise<void> {
    const blog = await this.blogsRepo.findOne({ where: { id } });
    if (!blog) throw new NotFoundException('Blog not found');
    blog.views = (blog.views || 0) + 1;
    await this.blogsRepo.save(blog);
  }

  // Single blog details
  async findOne(id: number): Promise<Blog> {
    const blog = await this.blogsRepo.findOne({
      where: { id, status: BlogStatus.APPROVED },
      relations: [
        'author',
        'comments',
        'comments.user',
        'comments.replies',
        'comments.replies.user',
      ],
    });
    if (!blog) throw new NotFoundException('Blog not found or not approved');
    return blog;
  }

  // Author: own blogs
  async findByAuthor(userId: number): Promise<Blog[]> {
    return this.blogsRepo.find({
      where: { author: { id: userId } },
      relations: ['author', 'comments'],
      order: { createdAt: 'DESC' },
    });
  }


async getAuthorBlogStats(userId: number) {
  const author = await this.usersRepo.findOne({ where: { id: userId } });
  if (!author) throw new NotFoundException('Author not found');

  const [total, approved, rejected, pending] = await Promise.all([
    this.blogsRepo.count({ where: { author: { id: userId } } }),
    this.blogsRepo.count({
      where: { author: { id: userId }, status: BlogStatus.APPROVED },
    }),
    this.blogsRepo.count({
      where: { author: { id: userId }, status: BlogStatus.REJECTED },
    }),
    this.blogsRepo.count({
      where: { author: { id: userId }, status: BlogStatus.PENDING },
    }),
  ]);

  return {
    authorName: author.name,
    authorEmail: author.email,      
    authorAvatar: author.avatar || null, 
    total,
    approved,
    rejected,
    pending,
  };


  
  }

  // Create blog
  async create(
    dto: CreateBlogDto,
    userId: number,
    imagePath?: string,
  ): Promise<Blog> {
    const blog = this.blogsRepo.create({
      ...dto,
      image: imagePath,
      author: { id: userId },
      status: BlogStatus.PENDING,
      views: 0,
    });
    return this.blogsRepo.save(blog);
  }

  // Pending blogs
  async findPending(): Promise<Blog[]> {
    return this.blogsRepo.find({
      where: { status: BlogStatus.PENDING },
      relations: ['author'],
      order: { createdAt: 'DESC' },
    });
  }

  // Approve blog
  async approve(id: number): Promise<Blog> {
    const blog = await this.blogsRepo.findOne({ where: { id } });
    if (!blog) throw new NotFoundException('Blog not found');
    blog.status = BlogStatus.APPROVED;
    return this.blogsRepo.save(blog);
  }

  // Reject blog
  async reject(id: number): Promise<{ message: string }> {
    const blog = await this.blogsRepo.findOne({ where: { id } });
    if (!blog) throw new NotFoundException('Blog not found');
    await this.blogsRepo.remove(blog);
    return { message: 'Blog rejected and removed' };
  }
}
