import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comments.entity';
import { Blog } from '../blogs/blog.entity';
import { User } from '../users/users.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepo: Repository<Comment>,
    @InjectRepository(Blog)
    private readonly blogsRepo: Repository<Blog>,
  ) {}

  async create(content: string, blogId: number, user: User) {
    const blog = await this.blogsRepo.findOne({ where: { id: blogId } });
    if (!blog) throw new NotFoundException('Blog not found');

    const comment = this.commentsRepo.create({ content, blog, user });
    return this.commentsRepo.save(comment);
  }

  async findByBlog(blogId: number) {
    return this.commentsRepo.find({
      where: { blog: { id: blogId } },
      relations: ['user'],
    });
  }

  async approveComment(id: number) {
    const comment = await this.commentsRepo.findOne({ where: { id } });
    if (!comment) throw new NotFoundException('Comment not found');

    comment.isApproved = true;
    return this.commentsRepo.save(comment);
  }

  async delete(id: number) {
    const comment = await this.commentsRepo.findOne({ where: { id } });
    if (!comment) throw new NotFoundException('Comment not found');

    return this.commentsRepo.remove(comment);
  }
}
