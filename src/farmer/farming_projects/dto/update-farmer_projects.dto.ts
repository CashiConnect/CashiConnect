import { PartialType } from '@nestjs/swagger';
import { CreateFarmingProjectDto } from './create-farmer_projects.dto.js';

export class UpdateFarmingProjectDto extends PartialType(CreateFarmingProjectDto) {}
