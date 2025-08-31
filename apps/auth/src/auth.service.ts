import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from './users/schemas/user.schema';
import { UserResponseDto } from './users/dto/use-created-response.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async getTokens(user: User) {
    const payload = { sub: user._id.toString(), email: user.email };

    const accessTokenExpiresIn =
      this.configService.get<string>('JWT_EXPIRATION');

    const refreshTokenExpiresIn = this.configService.get<string>(
      'JWT_REFRESH_EXPIRATION',
    );

    console.log({ accessTokenExpiresIn, refreshTokenExpiresIn });

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: accessTokenExpiresIn,
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: refreshTokenExpiresIn,
    });

    const accessTokenExpiresAt = new Date(
      Date.now() + this.msToMillis(accessTokenExpiresIn),
    );
    const refreshTokenExpiresAt = new Date(
      Date.now() + this.msToMillis(refreshTokenExpiresIn),
    );

    return {
      accessToken,
      accessTokenExpiresAt,
      refreshToken,
      refreshTokenExpiresAt,
    };
  }

  async login(user: User) {
    const {
      accessToken,
      refreshToken,
      accessTokenExpiresAt,
      refreshTokenExpiresAt,
    } = await this.getTokens(user);
    return {
      accessToken,
      refreshToken,
      accessTokenExpiresAt,
      refreshTokenExpiresAt,
      user: new UserResponseDto(user),
    };
  }

  async refresh(user: any) {
    const { accessToken } = await this.getTokens(user);
    return { accessToken };
  }

  msToMillis(str: string) {
    const unit = str.slice(-1);
    const value = parseInt(str.slice(0, -1));
    switch (unit) {
      case 's':
        return value * 1000;
      case 'm':
        return value * 60 * 1000;
      case 'h':
        return value * 60 * 60 * 1000;
      case 'd':
        return value * 24 * 60 * 60 * 1000;
      default:
        return value * 1000;
    }
  }
}
