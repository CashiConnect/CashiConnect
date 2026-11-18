import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectUpdateDto } from './create-project_updates.dto.js';

export class UpdateProjectUpdateDto extends PartialType(CreateProjectUpdateDto) {}
