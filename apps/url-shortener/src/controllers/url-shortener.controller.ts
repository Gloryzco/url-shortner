import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  NotFoundException,
  HttpStatus,
} from '@nestjs/common';

import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiExtraModels,
} from '@nestjs/swagger';
import { ResponseFormat } from '@app/common';
import { ConfigService } from '@nestjs/config';
import { UrlShortenerResponseDto, CreateShortUrlDto } from '../dtos';
import { UrlShortenerService } from '../services';

@ApiTags('URLs')
@ApiExtraModels(UrlShortenerResponseDto)
@Controller('urls')
export class UrlShortenerController {
  constructor(
    private readonly urlShortenerService: UrlShortenerService,
    private readonly configService: ConfigService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new short URL' })
  @ApiBody({ type: CreateShortUrlDto })
  @ApiCreatedResponse({ type: UrlShortenerResponseDto })
  async createShortUrl(@Body() dto: CreateShortUrlDto) {
    const entity = await this.urlShortenerService.create(dto);
    const baseUrl = this.getBaseUrl();
    const data = new UrlShortenerResponseDto(entity, baseUrl);

    return ResponseFormat.success(
      HttpStatus.CREATED,
      'Short URL created',
      data,
    );
  }

  @Get(':shortCode')
  @ApiOperation({ summary: 'Get a short URL by code' })
  @ApiOkResponse({ type: UrlShortenerResponseDto })
  @ApiNotFoundResponse({ description: 'Short URL not found' })
  async getShortUrl(@Param('shortCode') shortCode: string) {
    const entity = await this.urlShortenerService.findByCode(shortCode);
    if (!entity) throw new NotFoundException('Short URL not found');

    const baseUrl = this.getBaseUrl();
    const data = new UrlShortenerResponseDto(entity, baseUrl);

    return ResponseFormat.success(HttpStatus.OK, 'Short URL fetched', data);
  }

  private getBaseUrl(): string {
    const isDev = this.configService.get<string>('NODE_ENV') === 'development';
    return isDev
      ? `${this.configService.get<string>('APP_BASE_URL')}:${this.configService.get<string>('APP_PORT')}`
      : this.configService.get<string>('APP_BASE_URL');
  }
}
