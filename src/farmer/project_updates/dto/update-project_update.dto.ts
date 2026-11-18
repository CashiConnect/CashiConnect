import { PartialType } from '@nestjs/swagger';
import { CreateProjectUpdateDto } from './create-project_updates.dto.js';

export class UpdateProjectUpdateDto extends PartialType(CreateProjectUpdateDto) {}
