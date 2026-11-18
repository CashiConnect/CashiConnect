import {
  Body,
  Controller,
  Delete,
  Get,
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
import { CreateProjectUpdateDto } from './dto/create-project_updates.dto.js';
import { UpdateProjectUpdateDto } from './dto/update-project_update.dto.js';
import { ProjectUpdatesService } from './project_updates.service.js';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

type AuthenticatedRequest = Request & { user: { userId: number } };

@Controller()
@ApiTags('Farmer Project Updates')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProjectUpdatesController {
  constructor(private readonly projectUpdatesService: ProjectUpdatesService) {}

  @Post('project-updates')
  @FarmerOnly()
  create(
    @Body() dto: CreateProjectUpdateDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.projectUpdatesService.create(dto, req.user.userId);
  }

  @Patch('project-updates/:id')
  @FarmerOnly()
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProjectUpdateDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.projectUpdatesService.update(id, dto, req.user.userId);
  }

  @Delete('project-updates/:id')
  @FarmerOnly()
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.projectUpdatesService.remove(id, req.user.userId);
  }

  @Get('projects/:id/updates')
  timeline(@Param('id', ParseIntPipe) projectId: number) {
    return this.projectUpdatesService.findTimeline(projectId);
  }
}
