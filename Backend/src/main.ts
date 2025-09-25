import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as express from 'express';
import { AuthService } from './auth/auth.service';



async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // Serve uploads folder
      app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

     const authService = app.get(AuthService);
  await authService.ensureSuperAdmin();


  app.enableCors(); // allow frontend calls
  await app.listen(3000);
}
bootstrap();
