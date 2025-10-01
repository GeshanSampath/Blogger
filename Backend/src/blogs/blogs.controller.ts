import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
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
import { BlogsService } from './blogs.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { GetUser } from '../auth/get-user.decorator';
import type { Response } from 'express';
import { existsSync } from 'fs';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/users.entity';

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

  // ✅ Public: approved blogs only
  @Get()
  getAll() {
    return this.blogsService.findAll();
  }

  // ✅ Author: see own blogs
  @UseGuards(JwtAuthGuard)
  @Get('author')
  getMine(@GetUser('id') userId: number) {
    return this.blogsService.findByAuthor(userId);
  }

  // ✅ Author: create blog (defaults to PENDING)
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

  // ✅ Author: update blog
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/blogs',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBlogDto,
    @UploadedFile() file: Express.Multer.File,
    @GetUser('id') userId: number,
  ) {
    const imagePath = file ? `/uploads/blogs/${file.filename}` : undefined;
    return this.blogsService.update(id, dto, userId, imagePath);
  }

  // ✅ Author: delete blog
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number, @GetUser('id') userId: number) {
    return this.blogsService.delete(id, userId);
  }

  // ✅ Public: get approved comments
  @Get(':id/comments')
  getComments(@Param('id', ParseIntPipe) blogId: number) {
    return this.blogsService.getComments(blogId);
  }

  // ✅ Public: serve uploaded images
  @Get('images/:filename')
  getImage(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = join(process.cwd(), 'uploads/blogs', filename);
    if (!existsSync(filePath)) {
      return res.status(404).json({ message: 'Image not found' });
    }
    return res.sendFile(filePath);
  }

  // ✅ SuperAdmin: view pending blogs
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
}