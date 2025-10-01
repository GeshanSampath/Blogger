import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
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

  // 🔹 Public: approved blogs
  findAll(): Promise<Blog[]> {
    return this.blogsRepo.find({
      where: { status: BlogStatus.APPROVED },
      relations: ['author'],
    });
  }

  // 🔹 Author: see own blogs
  findByAuthor(userId: number): Promise<Blog[]> {
    return this.blogsRepo.find({
      where: { author: { id: userId } },
      relations: ['author', 'comments'],
    });
  }

  // 🔹 Create blog → defaults to PENDING
  async create(dto: CreateBlogDto, userId: number, imagePath: string): Promise<Blog> {
    const blog = this.blogsRepo.create({
      ...dto,
      image: imagePath,
      author: { id: userId },
      status: BlogStatus.PENDING,
    });
    return this.blogsRepo.save(blog);
  }

  // 🔹 Update blog by owner
  async update(id: number, dto: UpdateBlogDto, userId: number, imagePath?: string): Promise<Blog> {
    const blog = await this.blogsRepo.findOne({ where: { id }, relations: ['author'] });
    if (!blog) throw new NotFoundException('Blog not found');
    if (blog.author.id !== userId) throw new ForbiddenException('Not allowed');

    if (dto.title) blog.title = dto.title;
    if (dto.content) blog.content = dto.content;
    if (imagePath) blog.image = imagePath;

    return this.blogsRepo.save(blog);
  }

  // 🔹 Delete blog by owner
  async delete(id: number, userId: number): Promise<{ message: string }> {
    const blog = await this.blogsRepo.findOne({ where: { id }, relations: ['author'] });
    if (!blog) throw new NotFoundException('Blog not found');
    if (blog.author.id !== userId) throw new ForbiddenException('Not allowed');

    await this.blogsRepo.remove(blog);
    return { message: 'Blog deleted successfully' };
  }

  // 🔹 Fetch only approved comments for a blog
  async getComments(blogId: number) {
    const blog = await this.blogsRepo.findOne({ where: { id: blogId } });
    if (!blog) throw new NotFoundException('Blog not found');

   
  }

  // 🔹 SuperAdmin: get all pending blogs
  async findPending(): Promise<Blog[]> {
    return this.blogsRepo.find({
      where: { status: BlogStatus.PENDING },
      relations: ['author'],
    });
  }

  // 🔹 SuperAdmin: approve blog
  async approve(id: number): Promise<Blog> {
    const blog = await this.blogsRepo.findOne({ where: { id } });
    if (!blog) throw new NotFoundException('Blog not found');
    blog.status = BlogStatus.APPROVED;
    return this.blogsRepo.save(blog);
  }

  // 🔹 SuperAdmin: reject blog
  async reject(id: number): Promise<{ message: string }> {
    const blog = await this.blogsRepo.findOne({ where: { id } });
    if (!blog) throw new NotFoundException('Blog not found');

    await this.blogsRepo.remove(blog);
    return { message: 'Blog rejected and removed' };
  }
}