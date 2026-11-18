import { PartialType } from '@nestjs/mapped-types';
import { CreateInvestmentDto } from './create-investment.dto.js';

export class UpdateInvestmentDto extends PartialType(CreateInvestmentDto) {}
