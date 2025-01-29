import { Module } from '@nestjs/common';
import { AnalyicsService } from './analyics.service';
import { AnalyicsController } from './analyics.controller';

@Module({
  controllers: [AnalyicsController],
  providers: [AnalyicsService],
})
export class AnalyicsModule {}
