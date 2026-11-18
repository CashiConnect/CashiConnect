import { Controller, Get, Param, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { InvestmentReturnsService } from './investment-returns.service.js';

@Controller('investments')
@UseGuards(JwtAuthGuard)
export class InvestmentReturnsByInvestmentController {
  constructor(
    private readonly returnsService: InvestmentReturnsService,
  ) {}

  @Get(':id/returns')
  getReturns(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
  ) {
    return this.returnsService.forInvestment(
      id,
      req.user.userId,
    );
  }
}