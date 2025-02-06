import { Module } from '@nestjs/common';
import { AnalyicsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Analytics, AnalyticsSchema } from './entities/analytic.entity';

@Module({
  imports:[
    MongooseModule.forFeature([{ name: Analytics.name, schema:AnalyticsSchema  },]),
  ],
  controllers: [AnalyicsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService]
})
export class AnalyticsModule {}
