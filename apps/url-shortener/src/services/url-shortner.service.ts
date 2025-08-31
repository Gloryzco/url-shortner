import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateShortUrlDto } from '../dtos/create-short-url.dto';
import { UrlShortener } from '../schema';
import { UrlShortnerRepository } from '../url-shortner.repository';
import { encodeBase62 } from '@app/common';

@Injectable()
export class UrlShortenerService {
  constructor(private readonly urlShortenerRepository: UrlShortnerRepository) {}

  async create(dto: CreateShortUrlDto): Promise<UrlShortener> {
    const url = await this.urlShortenerRepository.create({
      originalUrl: dto.originalUrl,
      clicks: 0,
    });

    const objectId = url._id.toString();
    const num = parseInt(objectId.substring(0, 8), 16);
    const shortCode = encodeBase62(num);

    const updated = await this.urlShortenerRepository.findOneAndUpdate(
      { _id: url._id },
      { shortCode },
    );

    return updated;
  }

  async findByCode(shortCode: string): Promise<UrlShortener> {
    const url = await this.urlShortenerRepository.findOne({ shortCode });
    if (!url) {
      throw new NotFoundException('Short URL not found');
    }
    return url;
  }

  async incrementClicks(shortCode: string): Promise<void> {
    await this.urlShortenerRepository.findOneAndUpdate(
      { shortCode },
      { $inc: { clicks: 1 } },
    );
  }

  private generateShortCode(length = 6): string {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }
}
