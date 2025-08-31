import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { MongooseModule } from '@nestjs/mongoose';
import { UrlShortener, UrlShortenerSchema } from './schema';
import { DatabaseModule } from '@app/common';
import { UrlShortenerService } from './services';
import { UrlShortnerRepository } from './url-shortner.repository';
import { UrlShortenerController, RedirectController } from './controllers';
import { JwtModule } from '@nestjs/jwt';
import {
  JwtAuthMiddleware,
  RateLimitMiddleware,
} from '@app/common/middlewares';

@Module({
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([
      { name: UrlShortener.name, schema: UrlShortenerSchema },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGO_URI: Joi.string().required(),
        APP_PORT: Joi.number().required(),
        NODE_ENV: Joi.string().required(),
        APP_BASE_URL: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
      }),
      envFilePath: `./apps/url-shortener/.env`,
    }),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [UrlShortenerController, RedirectController],
  providers: [UrlShortenerService, UrlShortnerRepository],
})
export class UrlShortenerModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RateLimitMiddleware, JwtAuthMiddleware)
      .forRoutes(UrlShortenerController);
  }
}
