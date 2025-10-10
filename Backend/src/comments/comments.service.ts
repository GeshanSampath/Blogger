import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
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

  // Get all approved comments with approved replies
  async getCommentsWithReplies(blogId: number): Promise<Comment[]> {
    const comments = await this.commentRepository.find({
      where: { blog: { id: blogId }, isApproved: true },
      relations: ['user', 'replies', 'replies.user'],
      order: { createdAt: 'ASC' },
    });

    // Only include approved replies
    comments.forEach((comment) => {
      comment.replies = comment.replies.filter((r) => r.isApproved);
    });

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

  // Create new comment (pending approval)
  async createComment(blogId: number, userId: number, dto: CreateCommentDto): Promise<Comment> {
    const blog = await this.blogRepository.findOne({ where: { id: blogId, status: BlogStatus.APPROVED } });
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

  // Create reply to comment (pending approval)
  async createReply(commentId: number, userId: number, dto: CreateReplyDto): Promise<Reply> {
    const comment = await this.commentRepository.findOne({ where: { id: commentId } });
    if (!comment) throw new NotFoundException('Comment not found');

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const reply = this.replyRepository.create({
      content: dto.content,
      comment,
      user,
      isApproved: false, // Needs admin approval
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

  // Admin: approve reply
  async approveReply(id: number): Promise<Reply> {
    const reply = await this.replyRepository.findOne({ where: { id } });
    if (!reply) throw new NotFoundException('Reply not found');
    reply.isApproved = true;
    return this.replyRepository.save(reply);
  }

  // Optional: delete comment (admin)
  async deleteComment(id: number): Promise<{ message: string }> {
    const comment = await this.commentRepository.findOne({ where: { id } });
    if (!comment) throw new NotFoundException('Comment not found');
    await this.commentRepository.remove(comment);
    return { message: 'Comment deleted successfully' };
  }

  // Optional: delete reply (admin)
  async deleteReply(id: number): Promise<{ message: string }> {
    const reply = await this.replyRepository.findOne({ where: { id } });
    if (!reply) throw new NotFoundException('Reply not found');
    await this.replyRepository.remove(reply);
    return { message: 'Reply deleted successfully' };
  }
}
