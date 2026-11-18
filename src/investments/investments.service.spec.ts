
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { InvestmentsService } from './investments.service.js';

describe('InvestmentsService', () => {
  const repository = {
    findOneBy: vi.fn(),
    find: vi.fn(),
    create: vi.fn(),
    save: vi.fn(),
  };

  const profiles = {
    findByUserId: vi.fn(),
  };

  const projects = {
    findOne: vi.fn(),
    findMine: vi.fn(),
  };

  const service = new InvestmentsService(
    repository as any,
    profiles as any,
    projects as any,
  );

  beforeEach(() => vi.clearAllMocks());

  it('rejects investment into an unapproved project', async () => {
    profiles.findByUserId.mockResolvedValue({ id: 10 });
    projects.findOne.mockResolvedValue({ id: 5, status: 'pending' });

    await expect(
      service.create({ projectId: 5, amount: 100 }, 2),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('denies another investor access', async () => {
    repository.findOneBy.mockResolvedValue({ id: 1, investorId: 10 });
    profiles.findByUserId.mockResolvedValue({ id: 11 });

    await expect(
      service.findOne(1, 2, 'Investor'),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });
});
