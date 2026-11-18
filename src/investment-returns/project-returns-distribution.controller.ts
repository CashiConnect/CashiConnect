import {
  Controller,
  Post,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles, APP_ROLES } from '../common/decorators/roles.decorator.js';

import { InvestmentReturnsService } from './investment-returns.service.js';

@Controller('projects')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProjectReturnsDistributionController {
  constructor(
    private readonly returnsService: InvestmentReturnsService,
  ) {}

  @Post(':id/distribute-returns')
  @Roles(APP_ROLES.ADMIN)
  distribute(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.returnsService.distributeAfterHarvest(id);
  }
}