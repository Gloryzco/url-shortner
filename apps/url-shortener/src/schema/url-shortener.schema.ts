import { AbstractDocument } from '../../../../libs/common/src/database/src/abstract.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false, timestamps: true })
export class UrlShortener extends AbstractDocument {
  @Prop({ required: true })
  originalUrl: string;

  @Prop({ required: false, unique: true, index: true })
  shortCode?: string;

  @Prop({ default: 0 })
  clicks: number;

  @Prop({ required: false })
  expiresAt?: Date;

  readonly createdAt?: Date;
}

export const UrlShortenerSchema = SchemaFactory.createForClass(UrlShortener);
