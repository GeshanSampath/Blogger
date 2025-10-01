// src/comments/reply.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../users/users.entity';
import { Comment } from './comment.entity';

@Entity()
export class Reply {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  text: string;

  @ManyToOne(() => Comment, (comment) => comment.replies, { onDelete: 'CASCADE' })
  comment: Comment;

  // 🔹 So we can call `reply.user`
  @ManyToOne(() => User, (user) => user.replies)
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}