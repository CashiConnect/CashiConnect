import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HiringRequest } from './entities/hiring-request.entity.js';
import { FarmerProfile } from '../../farmer/farmer_profiles/entities/farmer_profile.entity.js';
import { User } from '../../users/entities/user.entity.js';
import { HiringRequestsService } from './hiring-requests.service.js';
import { HiringRequestsController } from './hiring-requests.controller.js';
import { LandsModule } from '../lands/lands.module.js';
import { LandownerProfilesModule } from '../landowner-profiles/landowner-profiles.module.js';

@Module({
    imports: [
        TypeOrmModule.forFeature([HiringRequest, FarmerProfile, User]),
        LandsModule,
        LandownerProfilesModule,
    ],
    controllers: [HiringRequestsController],
    providers: [HiringRequestsService],
})
export class HiringRequestsModule {}