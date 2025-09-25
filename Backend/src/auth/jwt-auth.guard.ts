import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers['authorization'];

    if (!authHeader) return false;

    const [, token] = authHeader.split(' ');
    if (!token) return false;

    try {
      const payload = this.jwtService.verify(token);
      request['user'] = payload; // attach user info to request
      return true;
    } catch (err) {
      return false;
    }
  }
}
