import { Test, TestingModule } from '@nestjs/testing';
import { InvestmentTransactionsService } from './investment-transactions.service.js';

describe('InvestmentTransactionsService', () => {
  let service: InvestmentTransactionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InvestmentTransactionsService],
    }).compile();

    service = module.get<InvestmentTransactionsService>(InvestmentTransactionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
