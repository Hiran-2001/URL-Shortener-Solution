import { Module } from '@nestjs/common';
import { AnalyicsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Analytics, AnalyticsSchema } from './entities/analytic.entity';
import { Url, UrlSchema } from 'src/url/entities/url.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Analytics.name, schema: AnalyticsSchema }, { name: Url.name, schema: UrlSchema }]),
  ],
  controllers: [AnalyicsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService]
})
export class AnalyticsModule { }
