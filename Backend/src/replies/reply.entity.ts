import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Comment } from '../comments/comment.entity';
import { User } from '../users/users.entity';

@Entity()
export class Reply {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @ManyToOne(() => Comment, (comment) => comment.replies, { onDelete: 'CASCADE' })
  comment: Comment;

  @ManyToOne(() => User, { eager: true })
  user: User;

  @Column({ default: false })
  isApproved: boolean; 

  @CreateDateColumn()
  createdAt: Date;
}
