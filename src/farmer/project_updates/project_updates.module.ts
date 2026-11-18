import { Module } from '@nestjs/common';
import { ProjectUpdatesService } from './project_updates.service.js';
import { ProjectUpdatesController } from './project_updates.controller.js';
import { ProjectUpdates } from './entities/project_update.entity.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FarmingProjects } from '../farming_projects/entities/farming_projects.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProjectUpdates, FarmingProjects]),
  ],
  controllers: [ProjectUpdatesController],
  providers: [ProjectUpdatesService],
})
export class ProjectUpdatesModule {}
