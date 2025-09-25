import { Test, TestingModule } from '@nestjs/testing';
import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';
import { Blog } from './blog.entity';
import { CreateBlogDto } from './dto/create-blog.dto';

describe('BlogsController', () => {
  let controller: BlogsController;
  let service: BlogsService;

  const mockBlog: Blog = {
    id: 1,
    title: 'Test Blog',
    content: 'Test content',
    author: 'Test Author',
    image: 'uploads/test-image.jpg',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockBlogService = {
    findAll: jest.fn().mockResolvedValue([mockBlog]),
    create: jest.fn().mockImplementation((dto: CreateBlogDto, imagePath: string) =>
      Promise.resolve({
        id: 1,
        ...dto,
        image: imagePath,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlogsController],
      providers: [
        {
          provide: BlogsService,
          useValue: mockBlogService,
        },
      ],
    }).compile();

    controller = module.get<BlogsController>(BlogsController);
    service = module.get<BlogsService>(BlogsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return an array of blogs', async () => {
    const result = await controller.getBlogs();
    expect(result).toEqual([mockBlog]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should create a blog with uploaded file', async () => {
    const createDto: CreateBlogDto = {
      title: 'Test Blog',
      content: 'Test content',
      author: 'Test Author',
    };

    // Mock uploaded file
    const mockFile = {
      filename: 'test-image.jpg',
    } as Express.Multer.File;

    // Call controller with correct 2 arguments
    const result = await controller.createBlog(
      mockFile,
      createDto
    );

    expect(result).toEqual({
      id: 1,
      ...createDto,
      image: `uploads/${mockFile.filename}`,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });

    expect(service.create).toHaveBeenCalledWith(
      createDto,
      `uploads/${mockFile.filename}`
    );
  });
});
