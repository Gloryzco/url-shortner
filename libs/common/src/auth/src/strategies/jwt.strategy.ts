import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Types } from 'mongoose';
import { UsersService } from 'apps/auth/src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: { sub: string; email: string }) {
    console.log('[JwtStrategy] payload:', payload);

    const user = await this.usersService.getUser({
      _id: new Types.ObjectId(payload.sub),
    });

    if (!user) {
      console.log('[JwtStrategy] User not found for sub:', payload.sub);
      throw new UnauthorizedException();
    }

    console.log('[JwtStrategy] User validated:', user.email);
    return user;
  }
}
