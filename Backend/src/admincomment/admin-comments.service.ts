import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../comments/comment.entity';

@Injectable()
export class AdminCommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
  ) {}

  async getAllComments(): Promise<Comment[]> {
    return this.commentRepo.find({
      relations: ['user', 'blog'],
      order: { createdAt: 'DESC' },
    });
  }

  async approveComment(commentId: number): Promise<Comment | null> {
    const comment = await this.commentRepo.findOne({ where: { id: commentId } });
    if (!comment) return null;

    comment.isApproved = true;
    return this.commentRepo.save(comment);
  }
}
