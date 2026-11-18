import {PartialType} from '@nestjs/swagger';
import {CreateLandDto} from './create-land.dto.js';

export class UpdateLandDto extends PartialType(CreateLandDto) {}