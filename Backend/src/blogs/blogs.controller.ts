import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { Blog } from './blog.entity';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Get()
  async getAll(): Promise<Blog[]> {
    return this.blogsService.findAll();
  }

  @Post()
  async create(@Body() createBlogDto: CreateBlogDto): Promise<Blog> {
    return this.blogsService.create(createBlogDto);
  }

 @Get(':id')
async getOne(@Param('id') id: number): Promise<Blog | null> {
  return this.blogsService.findOne(id);
}
}
