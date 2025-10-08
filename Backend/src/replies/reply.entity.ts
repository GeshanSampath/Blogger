import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../users/users.entity';
import { Comment } from '../comments/comment.entity';

@Entity()
export class Reply {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'longtext' })
  content: string;

  @ManyToOne(() => User, (user) => user.id, { eager: true })
  user: User;

  @ManyToOne(() => Comment, (comment) => comment.replies, { onDelete: 'CASCADE' })
  comment: Comment;

  @CreateDateColumn()
  createdAt: Date;
}
