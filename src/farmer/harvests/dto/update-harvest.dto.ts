import { PartialType } from '@nestjs/swagger';
import { CreateHarvestDto } from './create-harvest.dto.js';

export class UpdateHarvestDto extends PartialType(CreateHarvestDto) {}
