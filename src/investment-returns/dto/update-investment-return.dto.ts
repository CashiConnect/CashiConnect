import { PartialType } from '@nestjs/mapped-types';
import { CreateInvestmentReturnDto } from './create-investment-return.dto.js';

export class UpdateInvestmentReturnDto extends PartialType(CreateInvestmentReturnDto) {}
