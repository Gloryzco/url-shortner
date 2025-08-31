import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UserLoginDto {
  @IsNotEmpty({ message: 'Email is required.' })
  @ApiProperty({
    description: 'Email address of the user',
    example: 'andrewglory32@gmail.com',
    required: true,
    title: 'Email',
  })
  readonly email: string;

  @IsNotEmpty({ message: 'Password is required.' })
  @ApiProperty({
    description: 'Password of the user',
    example: 'Password123!',
    required: true,
    title: 'Password',
  })
  readonly password: string;
}
