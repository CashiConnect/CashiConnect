import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { APP_ROLES, Roles } from '../common/decorators/roles.decorator.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { InvestmentTransactionsService } from './investment-transactions.service.js';

@ApiTags('Investment Transactions') @ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('investments')
export class InvestmentTransactionsByInvestmentController {
  constructor(private readonly transactions: InvestmentTransactionsService) {}

  @Get(':id/transactions') @Roles(APP_ROLES.INVESTOR)
  forInvestment(@Param('id', ParseIntPipe) id: number, @CurrentUser('userId') userId: number) {
    return this.transactions.forInvestment(id, userId);
  }
}
