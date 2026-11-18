import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvestorProfilesModule } from '../investor-profiles/investor-profiles.module.js';
import { FarmingProjectsService } from '../farmer/farming_projects/farming_projects.service.js';
import { FarmingProjects } from '../farmer/farming_projects/entities/farming_projects.entity.js';
import { FarmerProfile } from '../farmer/farmer_profiles/entities/farmer_profile.entity.js';
import { Investment } from './entities/investment.entity.js';
import { InvestmentsController } from './investments.controller.js';
import { ProjectInvestmentsController } from './project-investments.controller.js';
import { InvestmentsService } from './investments.service.js';

@Module({
  imports: [
    InvestorProfilesModule,
    TypeOrmModule.forFeature([Investment, FarmingProjects, FarmerProfile]),
  ],
  // Existing FarmingProjectsModule does not export its service. Register its existing
  // service locally with its required repositories without editing that module.
  providers: [InvestmentsService, FarmingProjectsService],
  controllers: [InvestmentsController, ProjectInvestmentsController],
  exports: [InvestmentsService],
})
export class InvestmentsModule {}
