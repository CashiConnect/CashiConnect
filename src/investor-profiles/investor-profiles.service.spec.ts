import { Test, TestingModule } from '@nestjs/testing';
import { InvestorProfilesService } from './investor-profiles.service.js';

describe('InvestorProfilesService', () => {
  let service: InvestorProfilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InvestorProfilesService],
    }).compile();

    service = module.get<InvestorProfilesService>(InvestorProfilesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
