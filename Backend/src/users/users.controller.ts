import { Controller, Get, Patch, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('pending-authors')
  getPendingAuthors() {
    return this.usersService.findAllAuthorsPendingApproval();
  }

  @Patch('approve/:id')
  approveAuthor(@Param('id') id: string) {
    return this.usersService.approveAuthor(+id);
  }
}
