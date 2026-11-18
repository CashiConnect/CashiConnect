import {OmitType, PartialType} from '@nestjs/swagger';
import { CreateHiringRequestDto } from './create-hiring-request.dto.js';

export class UpdateHiringRequestDto extends PartialType(
      OmitType(CreateHiringRequestDto, ['farmer_id', 'land_id'] as const),
) {}