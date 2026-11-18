import {PartialType} from '@nestjs/swagger';
import {CreateLandownerProfileDto} from './create-landowner-profile.dto.js';

export class UpdateLandownerProfileDto extends PartialType(CreateLandownerProfileDto) {}