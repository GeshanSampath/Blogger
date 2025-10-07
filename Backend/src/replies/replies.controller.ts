import { Controller, Post, Param, Body, ParseIntPipe, Req, UseGuards } from '@nestjs/common';
import { RepliesService } from './replies.service';
import { CreateReplyDto } from './dto/create-reply.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('blogs/:blogId/comments/:commentId/replies')
export class RepliesController {
  constructor(private readonly repliesService: RepliesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  addReply(
    @Param('blogId', ParseIntPipe) blogId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
    @Body() dto: CreateReplyDto,
    @Req() req: any,
  ) {
    return this.repliesService.addReply(blogId, commentId, dto, req.user.id);
  }
}