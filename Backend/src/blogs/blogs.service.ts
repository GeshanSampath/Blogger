import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog, BlogStatus } from './blog.entity';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { User } from '../users/users.entity';

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(Blog)
    private readonly blogsRepo: Repository<Blog>,
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  // Public: approved blogs
  async findAll(): Promise<Blog[]> {
    return this.blogsRepo.find({
      where: { status: BlogStatus.APPROVED },
      relations: ['author'],
      order: { createdAt: 'DESC' },
    });
  }

  // Author: own blogs
  async findByAuthor(userId: number): Promise<Blog[]> {
    return this.blogsRepo.find({
      where: { author: { id: userId } },
      relations: ['author', 'comments'],
      order: { createdAt: 'DESC' },
    });
  }

  // Author: stats
  async getAuthorBlogStats(userId: number) {
    const author = await this.usersRepo.findOne({ where: { id: userId } });
    if (!author) throw new NotFoundException('Author not found');

    const [total, approved, rejected, pending] = await Promise.all([
      this.blogsRepo.count({ where: { author: { id: userId } } }),
      this.blogsRepo.count({ where: { author: { id: userId }, status: BlogStatus.APPROVED } }),
      this.blogsRepo.count({ where: { author: { id: userId }, status: BlogStatus.REJECTED } }),
      this.blogsRepo.count({ where: { author: { id: userId }, status: BlogStatus.PENDING } }),
    ]);

    return {
      authorName: author.name,
      total,
      approved,
      rejected,
      pending,
    };
  }

async findOne(id: number): Promise<Blog> {
  const blog = await this.blogsRepo.findOne({
    where: { id },
    relations: ['author', 'comments', 'comments.user', 'comments.replies', 'comments.replies.user'],
  });

  if (!blog || blog.status !== BlogStatus.APPROVED) {
    throw new NotFoundException(`Blog with id ${id} not found or not approved`);
  }

  return blog;
}
 
  // Create
  async create(dto: CreateBlogDto, userId: number, imagePath?: string): Promise<Blog> {
    const blog = this.blogsRepo.create({
      ...dto,
      image: imagePath,
      author: { id: userId },
      status: BlogStatus.PENDING,
    });
    return this.blogsRepo.save(blog);
  }

  // Update
  async update(id: number, dto: UpdateBlogDto, userId: number, imagePath?: string): Promise<Blog> {
    const blog = await this.blogsRepo.findOne({ where: { id }, relations: ['author'] });
    if (!blog) throw new NotFoundException('Blog not found');
    if (blog.author.id !== userId) throw new ForbiddenException('Not allowed');

    if (dto.title) blog.title = dto.title;
    if (dto.content) blog.content = dto.content;
    if (imagePath) blog.image = imagePath;

    return this.blogsRepo.save(blog);
  }

  // Delete
  async delete(id: number, userId: number): Promise<{ message: string }> {
    const blog = await this.blogsRepo.findOne({ where: { id }, relations: ['author'] });
    if (!blog) throw new NotFoundException('Blog not found');
    if (blog.author.id !== userId) throw new ForbiddenException('Not allowed');

    await this.blogsRepo.remove(blog);
    return { message: 'Blog deleted successfully' };
  }

  // Pending blogs
  async findPending(): Promise<Blog[]> {
    return this.blogsRepo.find({
      where: { status: BlogStatus.PENDING },
      relations: ['author'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOneWithAccess(id: number, userId?: number): Promise<Blog> {
  const blog = await this.blogsRepo.findOne({
    where: { id },
    relations: ['author', 'comments', 'comments.user', 'comments.replies', 'comments.replies.user'],
  });

  if (!blog) throw new NotFoundException('Blog not found');

  if (blog.status === BlogStatus.APPROVED) return blog;

  if (userId && blog.author.id === userId) return blog;

  throw new NotFoundException('Blog not found or not approved');
}




  // Approve
  async approve(id: number): Promise<Blog> {
    const blog = await this.blogsRepo.findOne({ where: { id } });
    if (!blog) throw new NotFoundException('Blog not found');
    blog.status = BlogStatus.APPROVED;
    return this.blogsRepo.save(blog);
  }

  // Reject
  async reject(id: number): Promise<{ message: string }> {
    const blog = await this.blogsRepo.findOne({ where: { id } });
    if (!blog) throw new NotFoundException('Blog not found');
    await this.blogsRepo.remove(blog);
    return { message: 'Blog rejected and removed' };
  }
}
