
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { APP_ROLES, Roles } from '../common/decorators/roles.decorator.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';

import { InvestmentsService } from './investments.service.js';
import { CreateInvestmentDto } from './dto/create-investment.dto.js';
import { UpdateInvestmentDto } from './dto/update-investment.dto.js';

@ApiTags('Investments')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('investments')
export class InvestmentsController {
  constructor(
    private readonly investmentsService: InvestmentsService,
  ) {}

  @Post()
  @Roles(APP_ROLES.INVESTOR)
  create(
    @Body() createInvestmentDto: CreateInvestmentDto,
    @CurrentUser('userId') userId: number,
  ) {
    return this.investmentsService.create(
      createInvestmentDto,
      userId,
    );
  }

  @Get()
  @Roles(APP_ROLES.ADMIN, APP_ROLES.INVESTOR)
  findAll(
    @CurrentUser('userId') userId: number,
    @CurrentUser('role') role: string,
  ) {
    return this.investmentsService.findAll(userId, role);
  }

  @Get(':id')
  @Roles(APP_ROLES.ADMIN, APP_ROLES.INVESTOR)
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('userId') userId: number,
    @CurrentUser('role') role: string,
  ) {
    return this.investmentsService.findOne(
      id,
      userId,
      role,
    );
  }

  @Patch(':id')
  @Roles(APP_ROLES.ADMIN)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateInvestmentDto: UpdateInvestmentDto,
  ) {
    return this.investmentsService.update(
      id,
      updateInvestmentDto,
    );
  }

  @Delete(':id')
  @Roles(APP_ROLES.INVESTOR)
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('userId') userId: number,
  ) {
    return this.investmentsService.cancel(id, userId);
  }
}
