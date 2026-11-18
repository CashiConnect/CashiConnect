import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service.js';
import { CreateReportDto } from './dto/create-report.dto.js';
import { ReportQueryDto } from './dto/report-query.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { APP_ROLES, Roles } from '../common/decorators/roles.decorator.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import {UpdateReportStatusDto } from './dto/update-report-status.dto.js'


@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReportsController {

  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  create( @Body() dto: CreateReportDto,  @CurrentUser('userId') userId: number ) {
    return this.reportsService.create(dto, userId);
  }

  @Get()
  findAll(
    @Query() query: ReportQueryDto,
    @CurrentUser('userId') userId: number,
    @CurrentUser('role') role: string,
  ) {
    return this.reportsService.findAll(query, userId, role);
  }

  @Patch(':id/status')
  @Roles(APP_ROLES.ADMIN)
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateReportStatusDto,
  ) {
    return this.reportsService.updateStatus(id, dto);
  }
}