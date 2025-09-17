import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactModule } from './contact/contact.module';
import { BlogsModule } from './blogs/blogs.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',       // XAMPP MySQL username
      password: '',           // XAMPP MySQL password
      database: 'blogger', // Database name
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,      // auto-create tables (dev only)
    }),
    BlogsModule,
    ContactModule,
  ],
})
export class AppModule {}