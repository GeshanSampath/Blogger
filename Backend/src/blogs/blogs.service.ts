import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog } from './blog.entity';
import { CreateBlogDto } from './dto/create-blog.dto';

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(Blog)
    private readonly blogRepo: Repository<Blog>,
  ) {}

  // Fetch all blogs, newest first
  async findAll(): Promise<Blog[]> {
    return this.blogRepo.find({ order: { createdAt: 'DESC' } });
  }

  // Fetch a single blog by id
  async findOne(id: number): Promise<Blog | null> {
    return this.blogRepo.findOneBy({ id });
  }

  // Create a blog with image
  async create(dto: CreateBlogDto, imagePath: string): Promise<Blog> {
    const blog = this.blogRepo.create({ ...dto, image: imagePath });
    return this.blogRepo.save(blog);
  }
}
