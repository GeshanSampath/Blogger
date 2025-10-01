import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from './users.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Get authors waiting for approval
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Get('pending-authors')
  getPendingAuthors() {
    return this.usersService.findAllAuthorsPendingApproval();
  }

  // Approve author by ID
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Patch('approve/:id')
  approveAuthor(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.approveAuthor(id);
  }

  // ❌ Reject/Delete author by ID
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Delete('reject/:id')
  rejectAuthor(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.rejectAuthor(id);
  }
}