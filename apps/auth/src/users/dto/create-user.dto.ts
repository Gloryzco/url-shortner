import { IsNotDisposableEmail, PasswordValidator } from '@app/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Email is required.' })
  @IsString({ message: 'Email must be a string' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotDisposableEmail()
  @ApiProperty({
    description: 'Email address of the user',
    example: 'andrewglory32@gmail.com',
    required: true,
    title: 'Email',
  })
  readonly email: string;

  @IsNotEmpty({ message: 'Password is required.' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(8, {
    message: 'Password must be at least 8 characters long',
  })
  @PasswordValidator()
  @ApiProperty({
    description: 'Password of the user',
    example: 'Passwo1!',
    required: true,
    title: 'Password',
  })
  readonly password: string;
}
