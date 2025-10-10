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
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //  All users except SUPER_ADMIN
  @Get()
  getAll() {
    return this.usersService.findAll();
  }

  //  Only regular users
  @Get('only-users')
  getUsers() {
    return this.usersService.findOnlyUsers();
  }

  //  Only authors
  @Get('only-authors')
  getAuthors() {
    return this.usersService.findOnlyAuthors();
  }

  //  Pending authors
  @Get('pending-authors')
  getPendingAuthors() {
    return this.usersService.findAllAuthorsPendingApproval();
  }

  //  Approve author
  @Patch('approve/:id')
  approveAuthor(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.approveAuthor(id);
  }

  //  Reject author
  @Delete('reject/:id')
  rejectAuthor(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.rejectAuthor(id);
  }
}
