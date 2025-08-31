import { Module, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ModelDefinition, MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const logger = new Logger('DatabaseModule');
        const uri = configService.get<string>('MONGO_URI');

        try {
          logger.log('Connected to MongoDB server');
          return { uri };
        } catch (err: unknown) {
          if (err instanceof Error) {
            logger.error(`Error connecting to DB: ${err.message}`, err.stack);
            throw err;
          }
          throw new Error('Unknown database connection error');
        }
      },
    }),
  ],
})
export class DatabaseModule {
  static forFeature(models: ModelDefinition[]) {
    return MongooseModule.forFeature(models);
  }
}
