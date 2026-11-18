import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvestorProfile } from './entities/investor-profile.entity.js';
import { InvestorProfilesController } from './investor-profiles.controller.js';
import { InvestorProfilesService } from './investor-profiles.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([InvestorProfile])],
  controllers: [InvestorProfilesController],
  providers: [InvestorProfilesService],
  exports: [InvestorProfilesService],
})
export class InvestorProfilesModule {}
