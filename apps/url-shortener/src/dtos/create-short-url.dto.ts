import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUrl } from 'class-validator';

export class CreateShortUrlDto {
  @ApiProperty({
    description: 'The original URL to be shortened',
    required: true,
  })
  @IsUrl()
  @IsNotEmpty()
  originalUrl: string;
}
