// src/dashboard/dashboard.controller.ts
import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('users-count')
  getUsersCount() {
    return this.dashboardService.getUsersCount();
  }

  @Get('blogs-count')
  getBlogsCount() {
    return this.dashboardService.getBlogsCount();
  }

  @Get('blog-trends')
  getBlogTrends() {
    return this.dashboardService.getBlogTrends();
  }
}
