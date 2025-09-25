import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog } from './blog.entity';
import { Comment } from '../comments/comments.entity';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(Blog)
    private readonly blogsRepo: Repository<Blog>,
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
  ) {}

  findAll(): Promise<Blog[]> {
    return this.blogsRepo.find({
      where: { status: 'approved' },
      relations: ['author'],
    });
  }

  findByAuthor(userId: number): Promise<Blog[]> {
    return this.blogsRepo.find({
      where: { author: { id: userId } },
      relations: ['author', 'comments'],
    });
  }

  async create(dto: CreateBlogDto, userId: number, imagePath?: string): Promise<Blog> {
    const blog = this.blogsRepo.create({
      ...dto,
      imageUrl: imagePath ?? undefined,
      author: { id: userId },
      status: 'pending',
    });
    return this.blogsRepo.save(blog);
  }

  async update(id: number, dto: UpdateBlogDto, userId: number, imagePath?: string): Promise<Blog> {
    const blog = await this.blogsRepo.findOne({
      where: { id },
      relations: ['author', 'comments'],
    });
    if (!blog) throw new NotFoundException('Blog not found');
    if (blog.author.id !== userId) throw new ForbiddenException('Not allowed');

    Object.assign(blog, dto);

    if (imagePath !== undefined) {
      blog.imageUrl = imagePath;
    }

    return this.blogsRepo.save(blog);
  }

  async delete(id: number, userId: number): Promise<{ message: string }> {
    const blog = await this.blogsRepo.findOne({
      where: { id },
      relations: ['author'],
    });
    if (!blog) throw new NotFoundException('Blog not found');
    if (blog.author.id !== userId) throw new ForbiddenException('Not allowed');

    await this.blogsRepo.remove(blog);
    return { message: 'Blog deleted successfully' };
  }

  async getComments(blogId: number) {
    const blog = await this.blogsRepo.findOne({
      where: { id: blogId },
      relations: ['comments'],
    });
    if (!blog) throw new NotFoundException('Blog not found');
    return blog.comments?.filter(c => c.status === 'approved') ?? [];
  }
}
