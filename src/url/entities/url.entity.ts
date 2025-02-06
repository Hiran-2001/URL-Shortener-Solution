import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Url extends Document {
  @Prop({ required: true })
  longUrl: string;

  @Prop({ unique: true })
  shortUrl: string;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ unique: true, required: true }) 
  alias: string;

  @Prop()
  topic?: string;
}

export const UrlSchema = SchemaFactory.createForClass(Url);