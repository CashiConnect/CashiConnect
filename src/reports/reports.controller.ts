
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service.js';
import { CreateReportDto } from './dto/create-report.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';


@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReportsController {

  constructor(private readonly reportsService: ReportsService) {}

@Post()
create( @Body() dto: CreateReportDto, @CurrentUser('userId') userId: number ) {
     return this.reportsService.create(dto, userId);
  }
}