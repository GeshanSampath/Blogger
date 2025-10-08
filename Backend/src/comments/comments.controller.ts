import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateReplyDto } from '../replies/dto/create-reply.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../users/users.entity';

interface AuthRequest extends Request {
  user?: User;
}

@Controller('blogs/:blogId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  async getComments(@Param('blogId') blogId: string) {
    return this.commentsService.getCommentsWithReplies(+blogId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createComment(
    @Param('blogId') blogId: string,
    @Body() dto: CreateCommentDto,
    @Req() req: AuthRequest,
  ) {
    if (!req.user) throw new UnauthorizedException();
    return this.commentsService.createComment(+blogId, req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':commentId/replies')
  async createReply(
    @Param('blogId') blogId: string,
    @Param('commentId') commentId: string,
    @Body() dto: CreateReplyDto,
    @Req() req: AuthRequest,
  ) {
    if (!req.user) throw new UnauthorizedException();

    const isAuthor = await this.commentsService.isBlogAuthor(
      +blogId,
      req.user.id,
    );
    if (!isAuthor) throw new UnauthorizedException('Only blog author can reply');

    return this.commentsService.createReply(+commentId, req.user.id, dto);
  }
}
