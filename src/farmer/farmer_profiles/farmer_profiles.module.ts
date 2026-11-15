import { Module } from '@nestjs/common';
import { FarmerProfilesService } from './farmer_profiles.service.js';
import { FarmerProfilesController } from './farmer_profiles.controller.js';
import { FarmerProfile } from './entities/farmer_profile.entity.js';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [FarmerProfilesController],
  providers: [FarmerProfilesService],
  imports: [
    TypeOrmModule.forFeature([FarmerProfile])
  ],
})
export class FarmerProfilesModule {}
