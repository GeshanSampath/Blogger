import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto'; // We'll create this DTO

@Controller('auth') // Base path: /auth
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Register new user
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    try {
      const user = await this.authService.register(dto);
      return { message: 'User registered successfully', user };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  // Login
  @Post('login')
  async login(@Body() dto: LoginDto) {
    try {
      const result = await this.authService.login(dto.email, dto.password);
      return { message: 'Login successful', ...result };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
