import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../users/users.entity';
import { Comment } from '../comments/comments.entity';

export enum BlogStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
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
  image: string; // fixed from imageUrl

  @Column({ type: 'enum', enum: BlogStatus, default: BlogStatus.PENDING })
  status: BlogStatus;

  @ManyToOne(() => User, (user) => user.blogs, { eager: true })
  author: User;

  @OneToMany(() => Comment, (comment) => comment.blog, { cascade: true })
  comments: Comment[];
}
