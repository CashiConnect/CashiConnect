import { Module } from '@nestjs/common';
import { HarvestsService } from './harvests.service.js';
import { HarvestsController } from './harvests.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Harvest } from './entities/harvests.entity.js';
import { FarmingProjects } from '../farming_projects/entities/farming_projects.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Harvest, FarmingProjects])],
  controllers: [HarvestsController],
  providers: [HarvestsService],
})
export class HarvestsModule {}
