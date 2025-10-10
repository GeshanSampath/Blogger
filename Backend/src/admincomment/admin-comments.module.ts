import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminCommentsService } from './admin-comments.service';
import { AdminCommentsController } from './admin-comments.controller';
import { Comment } from '../comments/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment])],
  providers: [AdminCommentsService],
  controllers: [AdminCommentsController],
})
export class AdminCommentsModule {}
