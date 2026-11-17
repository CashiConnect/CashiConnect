import { PartialType } from '@nestjs/mapped-types';
import { CreateInvestmentTransactionDto } from './create-investment-transaction.dto.js';

export class UpdateInvestmentTransactionDto extends PartialType(CreateInvestmentTransactionDto) {}
