import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog, BlogStatus } from './blog.entity';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(Blog)
    private readonly blogsRepo: Repository<Blog>,
  ) {}

  // Public: approved blogs only
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

  // Single blog with comments/replies
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

    if (!blog) throw new NotFoundException(`Blog with id ${id} not found or not approved`);
    return blog;
  }

  async create(dto: CreateBlogDto, userId: number, imagePath?: string): Promise<Blog> {
    const blog = this.blogsRepo.create({
      ...dto,
      image: imagePath,
      author: { id: userId },
      status: BlogStatus.PENDING,
    });
    return this.blogsRepo.save(blog);
  }

  async update(id: number, dto: UpdateBlogDto, userId: number, imagePath?: string): Promise<Blog> {
    const blog = await this.blogsRepo.findOne({ where: { id }, relations: ['author'] });
    if (!blog) throw new NotFoundException('Blog not found');
    if (blog.author.id !== userId) throw new ForbiddenException('Not allowed');

    if (dto.title) blog.title = dto.title;
    if (dto.content) blog.content = dto.content;
    if (imagePath) blog.image = imagePath;

    return this.blogsRepo.save(blog);
  }

  async delete(id: number, userId: number): Promise<{ message: string }> {
    const blog = await this.blogsRepo.findOne({ where: { id }, relations: ['author'] });
    if (!blog) throw new NotFoundException('Blog not found');
    if (blog.author.id !== userId) throw new ForbiddenException('Not allowed');
    await this.blogsRepo.remove(blog);
    return { message: 'Blog deleted successfully' };
  }

  // Get comments (top-level only, with nested replies)
  async getComments(blogId: number) {
    const blog = await this.blogsRepo.findOne({
      where: { id: blogId, status: BlogStatus.APPROVED },
      relations: [
        'comments',
        'comments.user',
        'comments.replies',
        'comments.replies.user',
      ],
      order: { comments: { createdAt: 'DESC' } },
    });

    if (!blog) throw new NotFoundException('Blog not found or not approved');
    return blog.comments.filter((c) => !c.parent); // only top‑level
  }

  async findPending(): Promise<Blog[]> {
    return this.blogsRepo.find({
      where: { status: BlogStatus.PENDING },
      relations: ['author'],
      order: { createdAt: 'DESC' },
    });
  }

  async approve(id: number): Promise<Blog> {
    const blog = await this.blogsRepo.findOne({ where: { id } });
    if (!blog) throw new NotFoundException('Blog not found');
    blog.status = BlogStatus.APPROVED;
    return this.blogsRepo.save(blog);
  }

  async reject(id: number): Promise<{ message: string }> {
    const blog = await this.blogsRepo.findOne({ where: { id } });
    if (!blog) throw new NotFoundException('Blog not found');
    await this.blogsRepo.remove(blog);
    return { message: 'Blog rejected and removed' };
  }
}