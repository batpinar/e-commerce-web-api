import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export interface JwtPayload {
  sub: string; // UUID id
  email?: string; // Opsiyonel
  username?: string; // Opsiyonel
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: '1234567890', // Gerçekte process.env.JWT_SECRET olmalı
    });
  }

  async validate(payload: JwtPayload) {
    // Yalnızca kullanıcı ID'si döndürülür — güvenli ve yeterlidir
    return { id: payload.sub };
  }
}