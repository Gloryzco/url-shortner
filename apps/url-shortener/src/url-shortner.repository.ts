import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractRepository } from '../../../libs/common/src/database/src/abstract.repository';
import { UrlShortener } from './schema';

@Injectable()
export class UrlShortnerRepository extends AbstractRepository<UrlShortener> {
  protected readonly logger = new Logger(UrlShortnerRepository.name);

  constructor(
    @InjectModel(UrlShortener.name)
    urlShortenerModel: Model<UrlShortener>,
  ) {
    super(urlShortenerModel);
  }
}
