// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AuthService } from './auth/auth.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Static folder for uploads
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  });

  // Ensure default Super Admin exists
  const authService = app.get(AuthService);
  await authService.ensureSuperAdmin();

  // Enable CORS for frontend
  app.enableCors({
    origin: 'http://localhost:5173', // your React frontend
    credentials: true,
  });

  await app.listen(3000);
}
bootstrap();
