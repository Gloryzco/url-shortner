import { ApiProperty } from '@nestjs/swagger';
import { User } from '../schemas/user.schema';

export class UserResponseDto {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly email: string;

  @ApiProperty({ required: false })
  readonly createdAt?: Date;

  constructor(user: User) {
    this.id = user._id.toHexString();
    this.email = user.email;
    this.createdAt = user.createdAt;
  }
}
