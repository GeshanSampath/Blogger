import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';
import { Blog } from './blog.entity';
import { User } from '../users/users.entity';
import { Comment } from '../comments/comments.entity';
import { AuthModule } from '../auth/auth.module'; // 👈 import AuthModule

@Module({
  imports: [
    TypeOrmModule.forFeature([Blog, User, Comment]),
    AuthModule, // 👈 provides JwtService for JwtAuthGuard
  ],
  controllers: [BlogsController],
  providers: [BlogsService],
  exports: [BlogsService],
})
export class BlogsModule {}
