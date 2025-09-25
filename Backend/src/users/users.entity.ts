// src/users/users.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Blog } from '../blogs/blog.entity';
import { Comment } from '../comments/comments.entity';

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
  name: string;   // 👈 Add full name field

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 'author' })
  role: string;

  @Column({ default: false })
  isApproved: boolean;

  @OneToMany(() => Blog, blog => blog.author) 
  blogs: Blog[];

 @OneToMany(() => Comment, (comment) => comment.author)
comments: Comment[];
}
