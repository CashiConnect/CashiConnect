import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { APP_ROLES, Roles } from '../common/decorators/roles.decorator.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { InvestmentReturnsService } from './investment-returns.service.js';
import { CreateInvestmentReturnDto } from './dto/create-investment-return.dto.js';
import { UpdateInvestmentReturnDto } from './dto/update-investment-return.dto.js';

@ApiTags('Investment Returns') @ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('investment-returns')
export class InvestmentReturnsController {
  constructor(private readonly returns: InvestmentReturnsService) {}

  @Post() @Roles(APP_ROLES.ADMIN)
  create(@Body() dto: CreateInvestmentReturnDto) { return this.returns.create(dto); }

  @Get() @Roles(APP_ROLES.INVESTOR)
  findMine(@CurrentUser('userId') userId: number) { return this.returns.findMine(userId); }

  @Patch(':id') @Roles(APP_ROLES.ADMIN)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateInvestmentReturnDto) {
    return this.returns.update(id, dto);
  }
}
