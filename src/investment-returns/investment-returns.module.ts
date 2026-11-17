import { Module } from '@nestjs/common';
import { InvestmentReturnsService } from './investment-returns.service.js';
import { InvestmentReturnsController } from './investment-returns.controller.js';

@Module({
  controllers: [InvestmentReturnsController],
  providers: [InvestmentReturnsService],
})
export class InvestmentReturnsModule {}
