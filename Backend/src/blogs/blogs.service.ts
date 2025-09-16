import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog } from './blog.entity';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(Blog)
    private readonly repo: Repository<Blog>,
  ) {}

  async findAll(): Promise<Blog[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

 async findOne(id: number): Promise<Blog | null> {
  return this.repo.findOneBy({ id });
}


  async create(createBlogDto: CreateBlogDto): Promise<Blog> {
    const blog = this.repo.create(createBlogDto);
    return this.repo.save(blog);
  }

async update(id: number, updateBlogDto: UpdateBlogDto): Promise<Blog> {
  const blog = await this.repo.preload({
    id: id,
    ...updateBlogDto,
  });

  if (!blog) {
    throw new Error(`Blog with id ${id} not found`);
  }

  return this.repo.save(blog);
}

  async remove(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
