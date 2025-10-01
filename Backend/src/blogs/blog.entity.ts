// blog.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../users/users.entity';
import { Comment } from '../comments/comment.entity';

export enum BlogStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
}

@Entity()
export class Blog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ nullable: true })
  image: string;

  @Column({ type: 'enum', enum: BlogStatus, default: BlogStatus.PENDING })
  status: BlogStatus;

  @ManyToOne(() => User, (user) => user.blogs)
  author: User;

  @OneToMany(() => Comment, (c) => c.blog, { cascade: true })
  comments: Comment[];

  @CreateDateColumn()
  createdAt: Date;
}