import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvestmentsModule } from '../investments/investments.module.js';
import { InvestmentTransaction } from './entities/investment-transaction.entity.js';
import { InvestmentTransactionsController } from './investment-transactions.controller.js';
import { InvestmentTransactionsService } from './investment-transactions.service.js';

@Module({
  imports: [
    InvestmentsModule,
    TypeOrmModule.forFeature([InvestmentTransaction]),
  ],
  controllers: [InvestmentTransactionsController],
  providers: [InvestmentTransactionsService],
})
export class InvestmentTransactionsModule {}