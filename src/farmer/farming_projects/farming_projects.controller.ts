import { Controller } from '@nestjs/common';
import { FarmingProjectsService } from './farming_projects.service.js';

@Controller('farming-projects')
export class FarmingProjectsController {
  constructor(private readonly farmingProjectsService: FarmingProjectsService) {}
}
