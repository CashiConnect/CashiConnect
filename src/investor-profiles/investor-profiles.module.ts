import { Module } from '@nestjs/common';
import { InvestorProfilesService } from './investor-profiles.service.js';
import { InvestorProfilesController } from './investor-profiles.controller.js';

@Module({
  controllers: [InvestorProfilesController],
  providers: [InvestorProfilesService],
})
export class InvestorProfilesModule {}
