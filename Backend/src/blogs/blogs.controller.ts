import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  ParseIntPipe,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync } from 'fs';
import type { Response } from 'express';

import { BlogsService } from './blogs.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/users.entity';
import { CreateBlogDto } from './dto/create-blog.dto';

function editFileName(req, file, callback) {
  const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
  callback(null, `blog-${unique}${extname(file.originalname)}`);
}

function imageFileFilter(req, file, callback) {
  if (!file.mimetype.match(/^image\/(jpg|jpeg|png|gif)$/)) {
    return callback(new BadRequestException('Only image files allowed!'), false);
  }
  callback(null, true);
}

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  // ✅ Public: all approved blogs
  @Get()
  getAll() {
    return this.blogsService.findAll();
  }

  // ✅ Public: trending blogs (top 3 views)
  @Get('trending')
  trending() {
    return this.blogsService.findTopByViews(3);
  }

  // ✅ Increment view
  @Patch(':id/increment-view')
  incrementView(@Param('id', ParseIntPipe) id: number) {
    return this.blogsService.incrementViews(id);
  }

  // ✅ Author: own blogs
  @UseGuards(JwtAuthGuard)
  @Get('author')
  getMine(@GetUser('id') userId: number) {
    return this.blogsService.findByAuthor(userId);
  }

  // ✅ Author: stats
  @UseGuards(JwtAuthGuard)
  @Get('author/stats')
  getStats(@GetUser('id') userId: number) {
    return this.blogsService.getAuthorBlogStats(userId);
  }

  // ✅ Create blog
  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/blogs',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  create(
    @Body() dto: CreateBlogDto,
    @UploadedFile() file: Express.Multer.File,
    @GetUser('id') userId: number,
  ) {
    if (!file) throw new BadRequestException('Image is required');
    return this.blogsService.create(dto, userId, `/uploads/blogs/${file.filename}`);
  }

  // ✅ Serve uploaded images
  @Get('images/:filename')
  getImage(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = join(process.cwd(), 'uploads/blogs', filename);
    if (!existsSync(filePath)) {
      return res.status(404).json({ message: 'Image not found' });
    }
    return res.sendFile(filePath);
  }

  // ✅ SuperAdmin: pending blogs
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Get('pending')
  getPending() {
    return this.blogsService.findPending();
  }

  // ✅ SuperAdmin: approve blog
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Patch(':id/approve')
  approve(@Param('id', ParseIntPipe) id: number) {
    return this.blogsService.approve(id);
  }

  // ✅ SuperAdmin: reject blog
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Patch(':id/reject')
  reject(@Param('id', ParseIntPipe) id: number) {
    return this.blogsService.reject(id);
  }

  // ✅ Single blog details (PUT LAST)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.blogsService.findOne(id);
  }
}
