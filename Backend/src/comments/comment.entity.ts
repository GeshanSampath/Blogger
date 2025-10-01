// src/comments/comment.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../users/users.entity';
import { Blog } from '../blogs/blog.entity';
import { Reply } from './reply.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  text: string;

  @ManyToOne(() => Blog, (blog) => blog.comments, { onDelete: 'CASCADE' })
  blog: Blog;

  // 🔹 THIS must exist because the service code references `comment.user`
  @ManyToOne(() => User, (user) => user.comments, { eager: false })
  user: User;

  @OneToMany(() => Reply, (reply) => reply.comment, { cascade: true })
  replies: Reply[];

  @CreateDateColumn()
  createdAt: Date;
}