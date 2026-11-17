import { Injectable } from '@nestjs/common';
import { CreateInvestmentTransactionDto } from './dto/create-investment-transaction.dto.js';
import { UpdateInvestmentTransactionDto } from './dto/update-investment-transaction.dto.js';

@Injectable()
export class InvestmentTransactionsService {
  create(createInvestmentTransactionDto: CreateInvestmentTransactionDto) {
    return 'This action adds a new investmentTransaction';
  }

  findAll() {
    return `This action returns all investmentTransactions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} investmentTransaction`;
  }

  update(id: number, updateInvestmentTransactionDto: UpdateInvestmentTransactionDto) {
    return `This action updates a #${id} investmentTransaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} investmentTransaction`;
  }
}
