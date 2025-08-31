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

    this.logger.log('payload: ', JSON.stringify(payload));
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRATION') || '15m',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn:
        this.configService.get<string>('JWT_REFRESH_EXPIRATION') || '7d',
    });

    return { accessToken, refreshToken };
  }

  async login(user: User) {
    const { accessToken, refreshToken } = await this.getTokens(user);
    return { accessToken, refreshToken, user: new UserResponseDto(user) };
  }

  async refresh(user: any) {
    const { accessToken } = await this.getTokens(user);
    return { accessToken };
  }
}
