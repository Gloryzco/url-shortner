import { ApiProperty } from '@nestjs/swagger';
import { IsAlphanumeric, Length } from 'class-validator';

export class ShortCodeParamDto {
  @ApiProperty({
    description: 'Unique short code for the URL',
    example: 'a1B2c3',
    required: true,
    title: 'Short Code',
  })
  @IsAlphanumeric()
  @Length(6, 10)
  shortCode: string;
}
