
import { PartialType } from '@nestjs/mapped-types';
import { CreateFarmerProfileDto } from './create-farmer_profile.dto.js';
export class UpdateFarmerProfileDto  extends PartialType(CreateFarmerProfileDto) {
    
}