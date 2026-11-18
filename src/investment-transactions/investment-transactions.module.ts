import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvestmentTransactionsService } from './investment-transactions.service.js';
import { InvestmentTransactionsController } from './investment-transactions.controller.js';
import { InvestmentTransaction } from './entities/investment-transaction.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([InvestmentTransaction])],
  controllers: [InvestmentTransactionsController],
  providers: [InvestmentTransactionsService],
})
export class InvestmentTransactionsModule {}