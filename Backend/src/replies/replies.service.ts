import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reply } from './reply.entity';
import { Comment } from '../comments/comment.entity';
import { User } from '../users/users.entity';
import { CreateReplyDto } from './dto/create-reply.dto';

@Injectable()
export class RepliesService {
  constructor(
    @InjectRepository(Reply)
    private replyRepository: Repository<Reply>,

    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // Get all replies for a comment
  async getRepliesForComment(commentId: number): Promise<Reply[]> {
    return this.replyRepository.find({
      where: { comment: { id: commentId } },
      relations: ['user'],
      order: { createdAt: 'ASC' },
    });
  }

  // Create a reply
  async createReply(
    blogId: number,
    commentId: number,
    userId: number,
    dto: CreateReplyDto,
  ): Promise<Reply> {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
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
}
