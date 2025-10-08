import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { RepliesService } from './replies.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateReplyDto } from './dto/create-reply.dto';
import type { Request } from 'express';
import { User } from '../users/users.entity';

interface AuthRequest extends Request {
  user?: User;
}

@Controller('blogs/:blogId/comments/:commentId/replies')
export class RepliesController {
  constructor(private readonly repliesService: RepliesService) {}

  // Get all replies for a comment
  @Get()
  async getReplies(@Param('commentId') commentId: string) {
    return this.repliesService.getRepliesForComment(+commentId);
  }

  // Create a reply
  @UseGuards(JwtAuthGuard)
  @Post()
  async createReply(
    @Param('blogId') blogId: string,
    @Param('commentId') commentId: string,
    @Req() req: AuthRequest,
    @Body() dto: CreateReplyDto,
  ) {
    if (!req.user) throw new Error('Unauthorized');

    return this.repliesService.createReply(
      +blogId,
      +commentId,
      req.user.id,
      dto,
    );
  }
}
