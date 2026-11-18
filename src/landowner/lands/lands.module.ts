import {Type} from "class-transformer";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Module} from "@nestjs/common";
import {Land} from "./entities/land.entity.js";
import {LandsService} from "./lands.service.js";
import {LandsController} from "./lands.controller.js";
import {LandownerProfilesModule} from "../landowner-profiles/landowner-profiles.module.js";

@Module({   
    imports: [TypeOrmModule.forFeature([Land]), LandownerProfilesModule],
    controllers: [LandsController],
    providers: [LandsService],  
    exports: [LandsService],
})
export class LandsModule {}