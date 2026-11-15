import { Controller } from '@nestjs/common';
import { HarvestsService } from './harvests.service.js';

@Controller('harvests')
export class HarvestsController {
  constructor(private readonly harvestsService: HarvestsService) {}
}
