import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AnalyicsService } from './analyics.service';
import { CreateAnalyicDto } from './dto/create-analyic.dto';
import { UpdateAnalyicDto } from './dto/update-analyic.dto';

@Controller('analyics')
export class AnalyicsController {
  constructor(private readonly analyicsService: AnalyicsService) {}

  @Post()
  create(@Body() createAnalyicDto: CreateAnalyicDto) {
    return this.analyicsService.create(createAnalyicDto);
  }

  @Get()
  findAll() {
    return this.analyicsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.analyicsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAnalyicDto: UpdateAnalyicDto) {
    return this.analyicsService.update(+id, updateAnalyicDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.analyicsService.remove(+id);
  }
}
