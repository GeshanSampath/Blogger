import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'yourSecretKey', // 👈 use same secret as in JwtModule.register()
    });
  }

  async validate(payload: any) {
    // This becomes `req.user`
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
