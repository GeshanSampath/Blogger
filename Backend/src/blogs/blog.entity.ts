import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/users.entity';
import { Comment } from '../comments/comments.entity';

export enum BlogStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
}

@Entity()
export class Blog {
  @PrimaryGeneratedColumn() id: number;

  @Column({ length: 150 }) title: string;

  @Column('longtext') content: string;

  @Column() image: string;

  @Column({ type: 'enum', enum: BlogStatus, default: BlogStatus.PENDING })
  status: BlogStatus;

  @ManyToOne(() => User, (user) => user.blogs, { eager: true }) author: User;

  @OneToMany(() => Comment, (comment) => comment.blog, { cascade: true, onDelete: 'CASCADE' })
  comments: Comment[];

  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}