import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {LandImagesService} from './land-images.service.js';
import {LandImagesController} from './land-images.controller.js';
import {LandImage} from './entities/land-image.entity.js';
import {LandsModule} from '../lands/lands.module.js';
import {LandownerProfilesModule} from '../landowner-profiles/landowner-profiles.module.js';

@Module({       
    imports: [TypeOrmModule.forFeature([LandImage]), 
                LandsModule,
                LandownerProfilesModule],
    controllers: [LandImagesController],
    providers: [LandImagesService],
})
export class LandImagesModule {}