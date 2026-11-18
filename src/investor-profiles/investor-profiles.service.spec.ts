
import { ForbiddenException } from '@nestjs/common';
import { describe, it } from 'node:test';
import * as assert from 'node:assert/strict';

import { InvestorProfilesService } from './investor-profiles.service.js';

describe('InvestorProfilesService', () => {

  const repository = {
    findOneBy: async () => ({
      id: 1,
      userId: 2,
    }),

    findOne: async () => null,
    existsBy: async () => false,
    create: (data: any) => data,
    save: async (data: any) => data,
  };

  const service = new InvestorProfilesService(
    repository as any,
  );

  it('rejects access to another investor profile', async () => {
    await assert.rejects(
      service.findOne(1, 3, 'Investor'),
      ForbiddenException,
    );
  });

  it('allows admin to see a profile', async () => {
    const result = await service.findOne(1, 0, 'Admin');

    assert.equal(result.id, 1);
  });

});
