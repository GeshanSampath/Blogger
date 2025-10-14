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

  // Get all approved comments with all replies
  async getCommentsWithReplies(blogId: number): Promise<Comment[]> {
    const comments = await this.commentRepository.find({
      where: { blog: { id: blogId }, isApproved: true },
      relations: ['user', 'replies', 'replies.user'],
      order: { createdAt: 'ASC' },
    });

    // Replies are no longer filtered by approval
    return comments;
  }

  // Check if user is the blog author
  async isBlogAuthor(blogId: number, userId: number): Promise<boolean> {
    const blog = await this.blogRepository.findOne({
      where: { id: blogId, status: BlogStatus.APPROVED },
      relations: ['author'],
    });
    if (!blog) throw new NotFoundException('Blog not found');
    return blog.author.id === userId;
  }

  // Create new comment (pending admin approval)
  async createComment(
    blogId: number,
    userId: number,
    dto: CreateCommentDto,
  ): Promise<Comment> {
    const blog = await this.blogRepository.findOne({
      where: { id: blogId, status: BlogStatus.APPROVED },
    });
    if (!blog) throw new NotFoundException('Blog not found');

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const comment = this.commentRepository.create({
      content: dto.content,
      blog,
      user,
      isApproved: false, // Needs admin approval
    });

    return this.commentRepository.save(comment);
  }

  // Create reply to comment (no approval required)
  async createReply(
    commentId: number,
    userId: number,
    dto: CreateReplyDto,
  ): Promise<Reply> {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: ['blog', 'user'],
    });
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

  // Admin: approve comment
  async approveComment(id: number): Promise<Comment> {
    const comment = await this.commentRepository.findOne({ where: { id } });
    if (!comment) throw new NotFoundException('Comment not found');
    comment.isApproved = true;
    return this.commentRepository.save(comment);
  }

  // Delete comment
  async deleteComment(id: number): Promise<{ message: string }> {
    const comment = await this.commentRepository.findOne({ where: { id } });
    if (!comment) throw new NotFoundException('Comment not found');
    await this.commentRepository.remove(comment);
    return { message: 'Comment deleted successfully' };
  }


}
