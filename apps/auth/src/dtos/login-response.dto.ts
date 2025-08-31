import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '../users/dto/use-created-response.dto';

export class LoginResponseDto {
  @ApiProperty()
  readonly accessToken: string;

  @ApiProperty()
  readonly accessTokenExpiresAt: Date;

  @ApiProperty()
  readonly refreshToken: string;

  @ApiProperty()
  readonly refreshTokenExpiresAt: Date;

  @ApiProperty()
  readonly user: UserResponseDto;

  constructor(
    accessToken: string,
    accessTokenExpiresAt: Date,
    refreshToken: string,
    refreshTokenExpiresAt: Date,
    user: UserResponseDto,
  ) {
    this.accessToken = accessToken;
    this.accessTokenExpiresAt = accessTokenExpiresAt;
    this.refreshToken = refreshToken;
    this.refreshTokenExpiresAt = refreshTokenExpiresAt;
    this.user = user;
  }
}
