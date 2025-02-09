import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema()
export class Analytics {
  @Prop({ required: true, type: String })
  url: { type: mongoose.Schema.Types.ObjectId, ref: 'Url', required: true }

  @Prop({ required: true, type: Date })
  timestamp: Date;

  @Prop({ type: Object }) 
  userAgent: {
    browser: string;
    os: string;
    source: string; 
  } | null;

  @Prop({ required: true, type: String })
  ipAddress: string;

  @Prop({ type: Object }) 
  geolocation: {
    country: string;
    region: string;
    city: string;
    latitude: number;
    longitude: number;
  } | null;

  
}

export const AnalyticsSchema = SchemaFactory.createForClass(Analytics);