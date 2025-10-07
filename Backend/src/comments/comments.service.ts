import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { Blog } from '../blogs/blog.entity';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepo: Repository<Comment>,
    @InjectRepository(Blog)
    private readonly blogsRepo: Repository<Blog>,
  ) {}

  async getComments(blogId: number): Promise<Comment[]> {
    const blog = await this.blogsRepo.findOne({
      where: { id: blogId },
      relations: [
        'comments',
        'comments.user',
        'comments.replies',
        'comments.replies.user',
        'author',
      ],
    });
    if (!blog) throw new NotFoundException('Blog not found');

    return blog.comments.filter((c) => !c.parent);
  }

  async addComment(blogId: number, dto: CreateCommentDto, userId: number): Promise<Comment> {
    const blog = await this.blogsRepo.findOne({ where: { id: blogId } });
    if (!blog) throw new NotFoundException('Blog not found');

    const comment = this.commentsRepo.create({
      content: dto.content,
      blog,
      user: { id: userId } as any,
    });
    return this.commentsRepo.save(comment);
  }

  async addReply(blogId: number, commentId: number, dto: CreateCommentDto, userId: number): Promise<Comment> {
    const blog = await this.blogsRepo.findOne({
      where: { id: blogId },
      relations: ['author'],
    });
    if (!blog) throw new NotFoundException('Blog not found');

    console.log("Author ID:", blog.author.id, "User ID:", userId);

    if (+blog.author.id !== +userId) {
      throw new ForbiddenException('Only the blog author can reply to comments.');
    }

    const parent = await this.commentsRepo.findOne({ where: { id: commentId } });
    if (!parent) throw new NotFoundException('Parent comment not found');

    const reply = this.commentsRepo.create({
      content: dto.content,
      blog,
      parent,
      user: { id: userId } as any,
    });
    return this.commentsRepo.save(reply);
  }
}