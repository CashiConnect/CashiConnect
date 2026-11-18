import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { APP_ROLES, Roles } from '../common/decorators/roles.decorator.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { InvestmentTransactionsService } from './investment-transactions.service.js';
import { CreateInvestmentTransactionDto } from './dto/create-investment-transaction.dto.js';
import { UpdateInvestmentTransactionDto } from './dto/update-investment-transaction.dto.js';

@ApiTags('Investment Transactions') @ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('investment-transactions')
export class InvestmentTransactionsController {
  constructor(private readonly transactions: InvestmentTransactionsService) {}

  @Post() @Roles(APP_ROLES.INVESTOR)
  create(@Body() dto: CreateInvestmentTransactionDto, @CurrentUser('userId') userId: number) {
    return this.transactions.create(dto, userId);
  }

  @Get() @Roles(APP_ROLES.INVESTOR)
  findMine(@CurrentUser('userId') userId: number) { return this.transactions.findMine(userId); }

  @Patch(':id') @Roles(APP_ROLES.ADMIN)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateInvestmentTransactionDto) {
    return this.transactions.update(id, dto);
  }
}
