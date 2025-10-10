import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  UseGuards,
  UnauthorizedException,
  Patch,
  Delete,
} from '@nestjs/common';
import type { Request } from 'express';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateReplyDto } from '../replies/dto/create-reply.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole, User } from '../users/users.entity';

interface AuthRequest extends Request {
  user?: User;
}

@Controller('blogs/:blogId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  // ✅ Get only approved comments with approved replies
  @Get()
  async getComments(@Param('blogId') blogId: string) {
    return this.commentsService.getCommentsWithReplies(+blogId);
  }

  // ✅ Create comment (pending approval)
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

  // ✅ Create reply (only blog author) - pending approval
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

  // ✅ Admin approves a comment
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Patch('approve/:commentId')
  async approveComment(@Param('commentId') commentId: string) {
    return this.commentsService.approveComment(+commentId);
  }

  // ✅ Admin approves a reply
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Patch('replies/approve/:replyId')
  async approveReply(@Param('replyId') replyId: string) {
    return this.commentsService.approveReply(+replyId);
  }

  // ✅ Admin deletes a comment
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Delete(':commentId')
  async deleteComment(@Param('commentId') commentId: string) {
    return this.commentsService.deleteComment(+commentId);
  }

  // ✅ Admin deletes a reply
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Delete('replies/:replyId')
  async deleteReply(@Param('replyId') replyId: string) {
    return this.commentsService.deleteReply(+replyId);
  }
}
