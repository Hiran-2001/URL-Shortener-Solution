import { Test, TestingModule } from '@nestjs/testing';
import { AnalyicsController } from './analytics.controller';
import { AnalyicsService } from './analytics.service';

describe('AnalyicsController', () => {
  let controller: AnalyicsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnalyicsController],
      providers: [AnalyicsService],
    }).compile();

    controller = module.get<AnalyicsController>(AnalyicsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
