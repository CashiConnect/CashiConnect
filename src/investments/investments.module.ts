import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { InvestmentsController } from './investments.controller.js';
import { InvestmentsService } from './investments.service.js';
import { Investment } from './entities/investment.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Investment]),
  ],
  controllers: [InvestmentsController],
  providers: [InvestmentsService],
})
export class InvestmentsModule {}