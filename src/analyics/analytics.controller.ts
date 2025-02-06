import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateAnalyicDto } from './dto/create-analytic.dto';
import { UpdateAnalyicDto } from './dto/update-analytic.dto';
import { AnalyticsService } from './analytics.service';

@Controller('analyics')
export class AnalyicsController {
  constructor(private readonly analyicsService: AnalyticsService) {}

}
