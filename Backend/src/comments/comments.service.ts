import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { Blog, BlogStatus } from '../blogs/blog.entity';
import { User } from '../users/users.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateReplyDto } from '../replies/dto/create-reply.dto';
import { Reply } from '../replies/reply.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,

    @InjectRepository(Blog)
    private blogRepository: Repository<Blog>,

    @InjectRepository(Reply)
    private replyRepository: Repository<Reply>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getCommentsWithReplies(blogId: number): Promise<Comment[]> {
    return this.commentRepository.find({
      where: { blog: { id: blogId } },
      relations: ['user', 'replies', 'replies.user'],
      order: { createdAt: 'ASC' },
    });
  }

  async isBlogAuthor(blogId: number, userId: number): Promise<boolean> {
    const blog = await this.blogRepository.findOne({
      where: { id: blogId, status: BlogStatus.APPROVED },
      relations: ['author'],
    });
    if (!blog) throw new NotFoundException('Blog not found');
    return blog.author.id === userId;
  }

  async createComment(blogId: number, userId: number, dto: CreateCommentDto): Promise<Comment> {
    const blog = await this.blogRepository.findOne({ where: { id: blogId, status: BlogStatus.APPROVED } });
    if (!blog) throw new NotFoundException('Blog not found');

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const comment = this.commentRepository.create({
      content: dto.content,
      blog,
      user,
    });

    return this.commentRepository.save(comment);
  }

  async createReply(commentId: number, userId: number, dto: CreateReplyDto): Promise<Reply> {
    const comment = await this.commentRepository.findOne({ where: { id: commentId } });
    if (!comment) throw new NotFoundException('Comment not found');

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const reply = this.replyRepository.create({
      content: dto.content,
      comment,
      user,
    });

    return this.replyRepository.save(reply);
  }
}
