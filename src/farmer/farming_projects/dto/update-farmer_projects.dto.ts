import { PartialType } from '@nestjs/mapped-types';
import { CreateFarmingProjectDto } from './create-farmer_projects.dto.js';

export class UpdateFarmingProjectDto extends PartialType(CreateFarmingProjectDto) {}
