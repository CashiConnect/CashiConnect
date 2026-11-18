import { PartialType } from '@nestjs/mapped-types';
import { CreateInvestorProfileDto } from './create-investor-profile.dto.js';
export class UpdateInvestorProfileDto extends PartialType(CreateInvestorProfileDto) {}
