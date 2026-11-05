import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { Request } from 'express';
import { JWT_COOKIE_NAME, JWT_SECRET } from './jwt.constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (request: Request) => {
          const cookie: unknown = request.cookies?.[JWT_COOKIE_NAME];
          return typeof cookie === 'string' ? cookie : null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: JWT_SECRET,
    });
  }

  validate(payload: { sub: number; email: string; name?: string }) {
    return {
      userId: payload.sub,
      email: payload.email,
      name: payload.name,
    };
  }
}
