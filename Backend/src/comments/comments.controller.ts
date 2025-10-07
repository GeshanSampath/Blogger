import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('blogs/:blogId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  // GET /blogs/:blogId/comments
  @Get()
  getComments(@Param('blogId', ParseIntPipe) blogId: number) {
    return this.commentsService.getComments(blogId);
  }

  // POST /blogs/:blogId/comments
  @Post()
  addComment(
    @Param('blogId', ParseIntPipe) blogId: number,
    @Body() dto: CreateCommentDto,
    @Req() req: any,
  ) {
    return this.commentsService.addComment(blogId, dto, req.user?.id ?? 1);
  }

  // POST /blogs/:blogId/comments/:commentId/replies
  @Post(':commentId/replies')
  addReply(
    @Param('blogId', ParseIntPipe) blogId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
    @Body() dto: CreateCommentDto,
    @Req() req: any,
  ) {
    return this.commentsService.addReply(blogId, commentId, dto, req.user?.id ?? 1);
  }
}