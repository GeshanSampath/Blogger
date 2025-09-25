import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { BlogsService } from './blogs.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Get()
  async getAll() {
    return this.blogsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('author')
  async getAuthorBlogs(@Req() req) {
    const userId = req.user.id;
    if (!userId) throw new BadRequestException('User not found');
    return this.blogsService.findByAuthor(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/blogs',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `blog-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async createBlog(
    @Body() dto: CreateBlogDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
  ) {
    const userId = req.user.id;
    const imagePath = file ? `/uploads/blogs/${file.filename}` : undefined;
    return this.blogsService.create(dto, userId, imagePath);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/blogs',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `blog-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async updateBlog(
    @Param('id') id: number,
    @Body() dto: UpdateBlogDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
  ) {
    const userId = req.user.id;
    const imagePath = file ? `/uploads/blogs/${file.filename}` : undefined;
    return this.blogsService.update(id, dto, userId, imagePath);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteBlog(@Param('id') id: number, @Req() req) {
    const userId = req.user.id;
    return this.blogsService.delete(id, userId);
  }
}
