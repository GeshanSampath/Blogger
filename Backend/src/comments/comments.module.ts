import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { Comment } from './comment.entity';
import { Blog } from '../blogs/blog.entity';
import { User } from '../users/users.entity';
import { Reply } from '../replies/reply.entity';
import { RepliesService } from '../replies/replies.service';
import { RepliesController } from '../replies/replies.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Blog, User, Reply])],
  providers: [CommentsService, RepliesService],
  controllers: [CommentsController, RepliesController],
})
export class CommentsModule {}
