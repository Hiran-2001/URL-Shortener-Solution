import { Test, TestingModule } from '@nestjs/testing';
import { AnalyicsService } from './analytics.service';

describe('AnalyicsService', () => {
  let service: AnalyicsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnalyicsService],
    }).compile();

    service = module.get<AnalyicsService>(AnalyicsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
