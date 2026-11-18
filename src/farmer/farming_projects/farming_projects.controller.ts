import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js';
import { FarmerOnly } from '../../common/decorators/roles.decorator.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { CreateFarmingProjectDto } from './dto/create-farmer_projects.dto.js';
import { UpdateFarmingProjectDto } from './dto/update-farmer_projects.dto.js';
import { FarmingProjectsService } from './farming_projects.service.js';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

type AuthenticatedRequest = Request & { user: { userId: number } };

@Controller('projects')
@ApiTags('Farmer Projects')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FarmingProjectsController {
  constructor(private readonly farmingProjectsService: FarmingProjectsService) {}

  @Post()
  @FarmerOnly()
  create(
    @Body() dto: CreateFarmingProjectDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.farmingProjectsService.create(dto, req.user.userId);
  }

  @Get('my')
  @FarmerOnly()
  findMine(@Req() req: AuthenticatedRequest) {
    return this.farmingProjectsService.findMine(req.user.userId);
  }

  @Get()
  findAll(@Query('status') status?: string) {
    return this.farmingProjectsService.findAll(status);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.farmingProjectsService.findOne(id);
  }

  @Patch(':id')
  @FarmerOnly()
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateFarmingProjectDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.farmingProjectsService.update(id, dto, req.user.userId);
  }

  @Delete(':id')
  @FarmerOnly()
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.farmingProjectsService.remove(id, req.user.userId);
  }
}
