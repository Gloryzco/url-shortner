import { ApiProperty } from '@nestjs/swagger';
import { UrlShortener } from '../schema';

export class UrlShortenerResponseDto {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly originalUrl: string;

  @ApiProperty()
  readonly shortCode: string;

  @ApiProperty()
  readonly shortUrl: string;

  @ApiProperty()
  readonly clicks: number;

  @ApiProperty({ required: false })
  readonly expiresAt?: Date;

  @ApiProperty()
  readonly createdAt?: Date;

  constructor(urlShortener: UrlShortener, baseUrl: string) {
    this.id = urlShortener._id.toHexString();
    this.originalUrl = urlShortener.originalUrl;
    this.shortCode = urlShortener.shortCode;
    this.clicks = urlShortener.clicks;
    this.expiresAt = urlShortener.expiresAt;
    this.createdAt = urlShortener.createdAt;
    this.shortUrl = `${baseUrl}/${urlShortener.shortCode}`;
  }
}
