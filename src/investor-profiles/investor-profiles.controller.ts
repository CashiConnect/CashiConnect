import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InvestorProfilesService } from './investor-profiles.service.js';
import { CreateInvestorProfileDto } from './dto/create-investor-profile.dto.js';
import { UpdateInvestorProfileDto } from './dto/update-investor-profile.dto.js';

@Controller('investor-profiles')
export class InvestorProfilesController {
  constructor(private readonly investorProfilesService: InvestorProfilesService) {}

  @Post()
  create(@Body() createInvestorProfileDto: CreateInvestorProfileDto) {
    return this.investorProfilesService.create(createInvestorProfileDto);
  }

  @Get()
  findAll() {
    return this.investorProfilesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.investorProfilesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInvestorProfileDto: UpdateInvestorProfileDto) {
    return this.investorProfilesService.update(+id, updateInvestorProfileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.investorProfilesService.remove(+id);
  }
}
