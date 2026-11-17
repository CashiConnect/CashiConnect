import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {LandownerProfilesService} from './landowner-profiles.service.js';
import {LandownerProfilesController} from './landowner-profiles.controller.js';
import {LandownerProfile} from './entities/landowner-profile.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([LandownerProfile])],
  controllers: [LandownerProfilesController],   
    providers: [LandownerProfilesService],
    exports: [LandownerProfilesService],
})
export class LandownerProfilesModule {}