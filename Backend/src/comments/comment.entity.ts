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
import { Reply } from '../replies/reply.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column({ default: false })
  isApproved: boolean; // ✅ New: admin approval flag

  @ManyToOne(() => Blog, (blog) => blog.comments, { onDelete: 'CASCADE' })
  blog: Blog;

  @ManyToOne(() => User, { eager: true })
  user: User;

  @OneToMany(() => Reply, (r) => r.comment, { cascade: true })
  replies: Reply[];

  @CreateDateColumn()
  createdAt: Date;
}
