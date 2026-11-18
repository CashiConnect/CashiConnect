
import { PartialType } from '@nestjs/swagger';
import { CreateFarmerProfileDto } from './create-farmer_profile.dto.js';
export class UpdateFarmerProfileDto  extends PartialType(CreateFarmerProfileDto) {
    
}
