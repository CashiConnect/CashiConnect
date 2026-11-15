import { Module } from '@nestjs/common';
import { ProjectUpdatesService } from './project_updates.service.js';
import { ProjectUpdatesController } from './project_updates.controller.js';

@Module({
  controllers: [ProjectUpdatesController],
  providers: [ProjectUpdatesService],
})
export class ProjectUpdatesModule {}
