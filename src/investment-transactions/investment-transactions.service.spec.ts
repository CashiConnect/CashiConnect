
import { BadRequestException } from '@nestjs/common';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { InvestmentTransactionsService } from './investment-transactions.service.js';

describe('InvestmentTransactionsService', () => {
  const repository = {
    findOneBy: vi.fn(),
    exist: vi.fn(),
    create: vi.fn(),
    save: vi.fn(),
  };

  const investments = {
    findOne: vi.fn(),
    findAll: vi.fn(),
  };

  const service = new InvestmentTransactionsService(
    repository as any,
    investments as any,
  );

  beforeEach(() => vi.clearAllMocks());

  it('rejects payment recording on a cancelled investment', async () => {
    investments.findOne.mockResolvedValue({
      id: 1,
      amount: '100.00',
      status: 'cancelled',
    });

    await expect(
      service.create(
        {
          investmentId: 1,
          amount: 20,
          transactionReference: 'T1',
          paymentMethod: 'Cash',
        },
        8,
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
