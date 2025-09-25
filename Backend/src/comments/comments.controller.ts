import { Controller, Post, Get, Param, Body, Delete, Patch, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../users/users.entity';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':blogId')
  create(
    @Param('blogId') blogId: number,
    @Body('content') content: string,
    @GetUser() user: User,
  ) {
    return this.commentsService.create(content, blogId, user);
  }

  @Get('blog/:blogId')
  findByBlog(@Param('blogId') blogId: number) {
    return this.commentsService.findByBlog(blogId);
  }

  @Patch(':id/approve')
  approve(@Param('id') id: number) {
    return this.commentsService.approveComment(id);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.commentsService.delete(id);
  }
}
