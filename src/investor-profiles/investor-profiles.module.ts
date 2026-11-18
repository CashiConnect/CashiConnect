import { Module } from '@nestjs/common';
import { InvestorProfilesService } from './investor-profiles.service.js';
import { InvestorProfilesController } from './investor-profiles.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvestorProfile } from './entities/investor-profile.entity.js';


@Module({
  imports: [TypeOrmModule.forFeature([InvestorProfile])],
  controllers: [InvestorProfilesController],
  providers: [InvestorProfilesService],
})

export class InvestorProfilesModule { }
