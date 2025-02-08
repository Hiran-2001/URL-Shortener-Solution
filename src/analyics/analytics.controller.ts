import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException } from '@nestjs/common';
import { CreateAnalyicDto } from './dto/create-analytic.dto';
import { UpdateAnalyicDto } from './dto/update-analytic.dto';
import { AnalyticsService } from './analytics.service';

@Controller('api')
export class AnalyicsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('analytics/alias/:alias')
  async getUrlAnalytics(@Param('alias') alias: string) {
    try {
      return await this.analyticsService.getUrlAnalytics(alias);
      // console.log(alias,"alias");
      
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Failed to retrieve URL analytics');
    }
  }

  @Get('analytics/topic/:topic')
  async getTopicAnalytics(@Param('topic') topic: string) {
    try {
      // console.log(topic,"topic");
      
      return await this.analyticsService.getTopicAnalytics(topic);
    } catch (error) {
      throw new Error('Failed to retrieve topic analytics');
    }
  }

  @Get('analytics/overall')
  async getOverallAnalytics() {
    try {      
      return await this.analyticsService.getOverallAnalytics();
    } catch (error) {
      throw new Error('Failed to retrieve overall analytics');
    }
  }
}
