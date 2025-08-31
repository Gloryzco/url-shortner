import { Injectable, NotFoundException } from '@nestjs/common';
import { UrlShortenerService } from './url-shortner.service';

@Injectable()
export class RedirectService {
  constructor(private readonly urlShortenerService: UrlShortenerService) {}

  async resolveRedirect(shortCode: string): Promise<string> {
    const url = await this.urlShortenerService.findByCode(shortCode);
    if (!url) {
      throw new NotFoundException('Short URL not found');
    }
    await this.urlShortenerService.incrementClicks(shortCode);
    return url.originalUrl;
  }
}
