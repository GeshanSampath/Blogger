import { Test, TestingModule } from '@nestjs/testing';
import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';
import { Blog } from './blog.entity';
import { CreateBlogDto } from './dto/create-blog.dto';

describe('BlogsController', () => {
  let controller: BlogsController;
  let service: BlogsService;

  // Mock blog to match Blog entity
  const mockBlog: Blog = {
    id: 1,
    title: 'Test Blog',
    content: 'Test content',
    author: 'Test Author',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Mock service
  const mockBlogService = {
    findAll: jest.fn().mockResolvedValue([mockBlog]),
    create: jest.fn().mockImplementation((dto: CreateBlogDto) => 
      Promise.resolve({
        id: 1,
        ...dto,
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
    const result = await controller.getAll();
    expect(result).toEqual([mockBlog]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should create a blog', async () => {
    const createDto: CreateBlogDto = {
      title: 'Test Blog',
      content: 'Test content',
      author: 'Test Author',
    };
    const result = await controller.create(createDto);
    expect(result).toEqual({
      id: 1,
      ...createDto,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
    expect(service.create).toHaveBeenCalledWith(createDto);
  });
});
