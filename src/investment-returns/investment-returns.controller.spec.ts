import { Test, TestingModule } from '@nestjs/testing';
import { InvestmentReturnsController } from './investment-returns.controller.js';
import { InvestmentReturnsService } from './investment-returns.service.js';

describe('InvestmentReturnsController', () => {
  let controller: InvestmentReturnsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvestmentReturnsController],
      providers: [InvestmentReturnsService],
    }).compile();

    controller = module.get<InvestmentReturnsController>(InvestmentReturnsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
