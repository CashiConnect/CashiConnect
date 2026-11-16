import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityLogsService } from './activity-logs.service.js';
import { AdminActivityLog } from './entities/admin-activity-log.entity.js';

@Module({
    imports: [TypeOrmModule.forFeature([AdminActivityLog])],
    providers: [ActivityLogsService],
    exports: [ActivityLogsService],
})
export class ActivityLogsModule { } 