import { Test, TestingModule } from '@nestjs/testing';
import { InvestmentReturnsService } from './investment-returns.service.js';

describe('InvestmentReturnsService', () => {
  let service: InvestmentReturnsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InvestmentReturnsService],
    }).compile();

    service = module.get<InvestmentReturnsService>(InvestmentReturnsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
