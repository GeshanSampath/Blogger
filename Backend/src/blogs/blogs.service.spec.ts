import { Test, TestingModule } from '@nestjs/testing';
import { BlogsService } from './blogs.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Blog } from './blog.entity'; // Make sure this path is correct

describe('BlogService', () => {
  let service: BlogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlogsService,
        {
          provide: getRepositoryToken(Blog),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<BlogsService>(BlogsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
