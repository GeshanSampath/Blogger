import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RepliesService } from './replies.service';
import { RepliesController } from './replies.controller';
import { Reply } from './reply.entity';
import { Comment } from '../comments/comment.entity';
import { User } from '../users/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reply, Comment, User])],
  providers: [RepliesService],
  controllers: [RepliesController],
  exports: [RepliesService],
})
export class RepliesModule {}
