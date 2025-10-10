import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactModule } from './contact/contact.module';
import { BlogsModule } from './blogs/blogs.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CommentsModule } from './comments/comments.module';
import { RepliesModule } from './replies/replies.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AdminCommentsModule } from './admincomment/admin-comments.module';   



@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '', 
      database: 'blogger',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      
    }),
    BlogsModule,
    ContactModule,
    UsersModule,
    AuthModule,
    CommentsModule,
    RepliesModule,
    DashboardModule,
    AdminCommentsModule
    
  ],

  
})
export class AppModule {}
