import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '../users/dto/use-created-response.dto';

export class LoginResponseDto {
  @ApiProperty()
  readonly accessToken: string;

  @ApiProperty()
  readonly expiresAt: Date;

  @ApiProperty()
  readonly user: UserResponseDto;

  constructor(token: string, expiresAt: Date, user: UserResponseDto) {
    this.accessToken = token;
    this.expiresAt = expiresAt;
    this.user = user;
  }
}
