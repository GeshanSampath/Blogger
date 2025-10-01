// src/users/users.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Blog } from '../blogs/blog.entity';
import { Reply } from '../comments/reply.entity';
import { Comment } from '../comments/comment.entity'; // 🔹 You forgot this import

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  AUTHOR = 'author',
  USER = 'user',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Column({ default: false })
  isApproved: boolean;

  @OneToMany(() => Blog, (blog) => blog.author)
  blogs: Blog[];

  @OneToMany(() => Reply, (reply) => reply.user)
  replies: Reply[];

  // ✅ Now this compiles cleanly because Comment is properly imported
  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];
}