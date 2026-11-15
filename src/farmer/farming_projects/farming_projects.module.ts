import { Module } from '@nestjs/common';
import { FarmingProjectsService } from './farming_projects.service.js';
import { FarmingProjectsController } from './farming_projects.controller.js';

@Module({
  controllers: [FarmingProjectsController],
  providers: [FarmingProjectsService],
})
export class FarmingProjectsModule {}
