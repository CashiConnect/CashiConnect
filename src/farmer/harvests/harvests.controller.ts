import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js';
import { FarmerOnly } from '../../common/decorators/roles.decorator.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { CreateHarvestDto } from './dto/create-harvest.dto.js';
import { UpdateHarvestDto } from './dto/update-harvest.dto.js';
import { HarvestsService } from './harvests.service.js';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

type AuthenticatedRequest = Request & { user: { userId: number } };

@Controller('harvests')
@ApiTags('Farmer Harvests')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@FarmerOnly()
export class HarvestsController {
  constructor(private readonly harvestsService: HarvestsService) {}

  @Post()
  create(
    @Body() dto: CreateHarvestDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.harvestsService.create(dto, req.user.userId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateHarvestDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.harvestsService.update(id, dto, req.user.userId);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.harvestsService.remove(id, req.user.userId);
  }
}
