import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InvestmentTransactionsService } from './investment-transactions.service.js';
import { CreateInvestmentTransactionDto } from './dto/create-investment-transaction.dto.js';
import { UpdateInvestmentTransactionDto } from './dto/update-investment-transaction.dto.js';

@Controller('investment-transactions')
export class InvestmentTransactionsController {
  constructor(private readonly investmentTransactionsService: InvestmentTransactionsService) {}

  @Post()
  create(@Body() createInvestmentTransactionDto: CreateInvestmentTransactionDto) {
    return this.investmentTransactionsService.create(createInvestmentTransactionDto);
  }

  @Get()
  findAll() {
    return this.investmentTransactionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.investmentTransactionsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInvestmentTransactionDto: UpdateInvestmentTransactionDto) {
    return this.investmentTransactionsService.update(+id, updateInvestmentTransactionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.investmentTransactionsService.remove(+id);
  }
}
