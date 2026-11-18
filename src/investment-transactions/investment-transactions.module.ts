import { Module } from '@nestjs/common';
import { InvestmentTransactionsService } from './investment-transactions.service.js';
import { InvestmentTransactionsController } from './investment-transactions.controller.js';

@Module({
  controllers: [InvestmentTransactionsController],
  providers: [InvestmentTransactionsService],
})
export class InvestmentTransactionsModule {}
