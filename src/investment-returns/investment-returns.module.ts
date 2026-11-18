
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { InvestmentsModule } from '../investments/investments.module.js';
import { InvestmentReturn } from './entities/investment-return.entity.js';

import { InvestmentReturnsController } from './investment-returns.controller.js';
import { InvestmentReturnsByInvestmentController } from './investment-returns-by-investment.controller.js';
import { ProjectReturnsDistributionController } from './project-returns-distribution.controller.js';

import { InvestmentReturnsService } from './investment-returns.service.js';

@Module({
  imports: [
    InvestmentsModule,
    TypeOrmModule.forFeature([InvestmentReturn]),
  ],
  controllers: [
    InvestmentReturnsController,
    InvestmentReturnsByInvestmentController,
    ProjectReturnsDistributionController,
  ],
  providers: [InvestmentReturnsService],
})
export class InvestmentReturnsModule {}
