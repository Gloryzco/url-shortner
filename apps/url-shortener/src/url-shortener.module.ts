import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { MongooseModule } from '@nestjs/mongoose';
import { UrlShortener, UrlShortenerSchema } from './schema';
import { DatabaseModule } from '@app/common';
import { UrlShortenerService } from './services';
import { UrlShortnerRepository } from './url-shortner.repository';
import { UrlShortenerController, RedirectController } from './controllers';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGO_URI: Joi.string().required(),
        APP_PORT: Joi.number().required(),
        NODE_ENV: Joi.string().required(),
        APP_BASE_URL: Joi.string().required(),
      }),
      envFilePath: `./apps/url-shortner/.env`,
    }),
    DatabaseModule,
    MongooseModule.forFeature([
      { name: UrlShortener.name, schema: UrlShortenerSchema },
    ]),
  ],
  controllers: [UrlShortenerController, RedirectController],
  providers: [UrlShortenerService, UrlShortnerRepository],
})
export class UrlShortenerModule {}
