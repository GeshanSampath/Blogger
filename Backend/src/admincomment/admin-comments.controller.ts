import {
  Controller,
  Get,
  Patch,
  Param,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { AdminCommentsService } from './admin-comments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/users.entity';
import { ParseIntPipe } from '@nestjs/common';

@Controller('admin/comments')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN)
export class AdminCommentsController {
  constructor(private readonly adminCommentsService: AdminCommentsService) {}

  @Get()
  async getAllComments() {
    return this.adminCommentsService.getAllComments();
  }

  @Patch(':id/approve')
  async approveComment(@Param('id', ParseIntPipe) id: number) {
    const updated = await this.adminCommentsService.approveComment(id);
    if (!updated) throw new NotFoundException('Comment not found');
    return updated;
  }
}
