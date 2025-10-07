// src/replies/replies.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RepliesService } from './replies.service';
import { RepliesController } from './replies.controller';
import { Reply } from './reply.entity';
import { Comment } from '../comments/comment.entity';
import { Blog } from '../blogs/blog.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reply, Comment, Blog])],
  providers: [RepliesService],
  controllers: [RepliesController],
  exports: [RepliesService],
})
export class RepliesModule {}