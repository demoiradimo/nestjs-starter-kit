import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { ConfigService } from '../../config';
import { TokenPayload } from '../interfaces';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('auth.jwt.secret'),
    });
  }

  async validate(payload: TokenPayload) {
    const user = await this.authService.getUserFromTokenPayload(payload);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
