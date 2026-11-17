import { Injectable } from '@nestjs/common';
import { CreateInvestmentReturnDto } from './dto/create-investment-return.dto.js';
import { UpdateInvestmentReturnDto } from './dto/update-investment-return.dto.js';

@Injectable()
export class InvestmentReturnsService {
  create(createInvestmentReturnDto: CreateInvestmentReturnDto) {
    return 'This action adds a new investmentReturn';
  }

  findAll() {
    return `This action returns all investmentReturns`;
  }

  findOne(id: number) {
    return `This action returns a #${id} investmentReturn`;
  }

  update(id: number, updateInvestmentReturnDto: UpdateInvestmentReturnDto) {
    return `This action updates a #${id} investmentReturn`;
  }

  remove(id: number) {
    return `This action removes a #${id} investmentReturn`;
  }
}
