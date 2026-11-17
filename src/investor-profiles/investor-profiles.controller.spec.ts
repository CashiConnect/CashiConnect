import { Test, TestingModule } from '@nestjs/testing';
import { InvestorProfilesController } from './investor-profiles.controller.js';
import { InvestorProfilesService } from './investor-profiles.service.js';

describe('InvestorProfilesController', () => {
  let controller: InvestorProfilesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvestorProfilesController],
      providers: [InvestorProfilesService],
    }).compile();

    controller = module.get<InvestorProfilesController>(InvestorProfilesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
