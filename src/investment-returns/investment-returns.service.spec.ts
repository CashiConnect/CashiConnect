
import { BadRequestException } from '@nestjs/common';
import { describe, it } from 'node:test';
import { rejects } from 'node:assert/strict';

import { InvestmentReturnsService } from './investment-returns.service.js';

describe('InvestmentReturnsService', () => {
  const repository = {
    findOneBy: async ({ id }: { id: number }) => ({
      id,
      status: 'paid',
    }),
    create: (value: unknown) => value,
    save: async (value: unknown) => value,
  };

  const investments = {
    findOne: async () => null,
    findAll: async () => [],
  };

  const service = new InvestmentReturnsService(
    repository as any,
    investments as any,
  );

  it('prevents changing an already paid return', async () => {
    await rejects(
      () => service.update(7, { status: 'pending' }),
      BadRequestException,
    );
  });
});
