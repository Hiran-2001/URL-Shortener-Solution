import { Module } from '@nestjs/common';
import { UrlService } from './url.service';
import { UrlController } from './url.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Url, UrlSchema } from './entities/url.entity';
import { Analytics, AnalyticsSchema } from 'src/analyics/entities/analytic.entity';
import { AnalyticsService } from 'src/analyics/analytics.service';
import { AnalyticsModule } from 'src/analyics/analytics.module';

@Module({
  imports: [
    AnalyticsModule,
    MongooseModule.forFeature([{ name: Url.name, schema: UrlSchema }, { name: Analytics.name, schema:AnalyticsSchema  },]), // Registering the model
  ],
  controllers: [UrlController],
  providers: [UrlService,AnalyticsService],
})
export class UrlModule {}
