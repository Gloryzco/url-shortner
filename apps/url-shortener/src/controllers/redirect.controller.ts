import { Controller, Get, Param, Res, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import { UrlShortenerService } from '../services';
import { ShortCodeParamDto } from '../dtos';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller()
export class RedirectController {
  constructor(private readonly urlShortenerService: UrlShortenerService) {}

  @ApiExcludeEndpoint()
  @Get(':shortCode')
  async redirect(@Param() params: ShortCodeParamDto, @Res() res: Response) {
    const { shortCode } = params;
    const url = await this.urlShortenerService.findByCode(shortCode);
    if (!url) throw new NotFoundException('Short URL not found');

    await this.urlShortenerService.incrementClicks(shortCode);
    return res.redirect(url.originalUrl);
  }
}
