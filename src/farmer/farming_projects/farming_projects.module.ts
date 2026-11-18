import { Module } from '@nestjs/common';
import { FarmingProjectsService } from './farming_projects.service.js';
import { FarmingProjectsController } from './farming_projects.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FarmingProjects } from './entities/farming_projects.entity.js';
import { FarmerProfile } from '../farmer_profiles/entities/farmer_profile.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([FarmingProjects, FarmerProfile])],
  controllers: [FarmingProjectsController],
  providers: [FarmingProjectsService],
})
export class FarmingProjectsModule {}
