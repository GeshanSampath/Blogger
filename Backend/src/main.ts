import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AuthService } from './auth/auth.service';



async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
   app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  });

     const authService = app.get(AuthService);
  await authService.ensureSuperAdmin();


  app.enableCors(); 
}
bootstrap();
