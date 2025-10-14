// src/dashboard/dashboard.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { User } from '../users/users.entity';
import { Blog } from '../blogs/blog.entity';
import { Comment } from '../comments/comment.entity'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Blog, Comment]), 
  ],
  providers: [DashboardService],
  controllers: [DashboardController],
})
export class DashboardModule {}
