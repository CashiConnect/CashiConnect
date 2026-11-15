import { Controller } from '@nestjs/common';
import { ProjectUpdatesService } from './project_updates.service.js';

@Controller('project-updates')
export class ProjectUpdatesController {
  constructor(private readonly projectUpdatesService: ProjectUpdatesService) {}
}
