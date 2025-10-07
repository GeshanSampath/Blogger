import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reply } from './reply.entity';
import { Comment } from '../comments/comment.entity';
import { Blog } from '../blogs/blog.entity';
import { CreateReplyDto } from './dto/create-reply.dto';

@Injectable()
export class RepliesService {
  constructor(
    @InjectRepository(Reply) private readonly repliesRepo: Repository<Reply>,
    @InjectRepository(Comment) private readonly commentsRepo: Repository<Comment>,
    @InjectRepository(Blog) private readonly blogsRepo: Repository<Blog>,
  ) {}

  async addReply(blogId: number, commentId: number, dto: CreateReplyDto, userId: number): Promise<Reply> {
    const blog = await this.blogsRepo.findOne({ where: { id: blogId }, relations: ['author'] });
    if (!blog) throw new NotFoundException('Blog not found');

    console.log('Author ID:', blog.author.id, 'User ID:', userId);

    if (+blog.author.id !== +userId) {
      throw new ForbiddenException('Only the blog author can reply to comments.');
    }

    const comment = await this.commentsRepo.findOne({ where: { id: commentId } });
    if (!comment) throw new NotFoundException('Comment not found');

    const reply = this.repliesRepo.create({
      content: dto.content,
      comment,
      user: { id: userId } as any,
    });

    return this.repliesRepo.save(reply);
  }
}