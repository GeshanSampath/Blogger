// src/dashboard/dashboard.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { User } from '../users/users.entity';
import { Blog } from '../blogs/blog.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Blog])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
