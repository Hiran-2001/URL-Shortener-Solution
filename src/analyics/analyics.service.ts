import { Injectable } from '@nestjs/common';
import { CreateAnalyicDto } from './dto/create-analyic.dto';
import { UpdateAnalyicDto } from './dto/update-analyic.dto';

@Injectable()
export class AnalyicsService {
  create(createAnalyicDto: CreateAnalyicDto) {
    return 'This action adds a new analyic';
  }

  findAll() {
    return `This action returns all analyics`;
  }

  findOne(id: number) {
    return `This action returns a #${id} analyic`;
  }

  update(id: number, updateAnalyicDto: UpdateAnalyicDto) {
    return `This action updates a #${id} analyic`;
  }

  remove(id: number) {
    return `This action removes a #${id} analyic`;
  }
}
