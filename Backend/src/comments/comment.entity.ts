// src/comments/comment.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Blog } from '../blogs/blog.entity';
import { User } from '../users/users.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  // User who wrote the comment
  @ManyToOne(() => User, (user) => user.comments, { eager: true })
  user: User;

  // Blog the comment belongs to
  @ManyToOne(() => Blog, (blog) => blog.comments, { onDelete: 'CASCADE' })
  blog: Blog;

  // Replies to this comment
  @OneToMany(() => Comment, (reply) => reply.parent, { cascade: true })
  replies: Comment[];

  // If this is a reply, point to parent
  @ManyToOne(() => Comment, (comment) => comment.replies, { nullable: true })
  parent: Comment;
}