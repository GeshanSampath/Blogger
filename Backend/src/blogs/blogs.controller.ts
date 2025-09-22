import { Controller, Get, Post, Body, Param, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  // Get all blogs
  @Get()
  async getBlogs() {
    return this.blogsService.findAll();
  }

  // Get blog by id
  @Get(':id')
  async getBlog(@Param('id') id: number) {
    return this.blogsService.findOne(id);
  }

  // Create blog with image upload
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) return cb(new Error('Only image files are allowed!'), false);
        cb(null, true);
      },
    }),
  )
  async createBlog(
    @UploadedFile() file: Express.Multer.File,
    @Body() createBlogDto: CreateBlogDto,
  ) {
    if (!file) throw new Error('Image is required');
    const imagePath = `uploads/${file.filename}`;
    return this.blogsService.create(createBlogDto, imagePath);
  }
}
