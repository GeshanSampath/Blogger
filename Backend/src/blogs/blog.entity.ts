import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
import { User } from '../users/users.entity';
import { Comment } from '../comments/comments.entity';

@Entity()
export class Blog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column({ nullable: true })
  image: string; 

  @Column({ default: false })
  isPublished: boolean;

  @Column({ default: 'pending' })
  status: 'pending' | 'approved' | 'rejected';

  @ManyToOne(() => User, user => user.blogs, { eager: true })
  author: User;

  @OneToMany(() => Comment, comment => comment.blog, { cascade: true })
  comments: Comment[];

  @CreateDateColumn()
  createdAt: Date;
}
