import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { Roles, APP_ROLES } from '../common/decorators/roles.decorator.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { InvestmentsService } from './investments.service.js';

@ApiTags('Project Investments') @ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('projects')
export class ProjectInvestmentsController {
  constructor(private readonly investments: InvestmentsService) {}

  @Get(':id/investments') @Roles(APP_ROLES.FARMER, APP_ROLES.ADMIN)
  findProjectInvestments(@Param('id', ParseIntPipe) id: number,
    @CurrentUser('userId') userId: number, @CurrentUser('role') role: string) {
    return this.investments.projectInvestors(id, userId, role);
  }
}
