import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvestmentReturnsService } from './investment-returns.service.js';
import { InvestmentReturnsController } from './investment-returns.controller.js';
import { InvestmentReturn } from './entities/investment-return.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([InvestmentReturn])],
  controllers: [InvestmentReturnsController],
  providers: [InvestmentReturnsService],
})
export class InvestmentReturnsModule {}