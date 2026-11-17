import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InvestmentReturnsService } from './investment-returns.service.js';
import { CreateInvestmentReturnDto } from './dto/create-investment-return.dto.js';
import { UpdateInvestmentReturnDto } from './dto/update-investment-return.dto.js';

@Controller('investment-returns')
export class InvestmentReturnsController {
  constructor(private readonly investmentReturnsService: InvestmentReturnsService) {}

  @Post()
  create(@Body() createInvestmentReturnDto: CreateInvestmentReturnDto) {
    return this.investmentReturnsService.create(createInvestmentReturnDto);
  }

  @Get()
  findAll() {
    return this.investmentReturnsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.investmentReturnsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInvestmentReturnDto: UpdateInvestmentReturnDto) {
    return this.investmentReturnsService.update(+id, updateInvestmentReturnDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.investmentReturnsService.remove(+id);
  }
}
