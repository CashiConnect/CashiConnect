import { Module } from '@nestjs/common';
import { HarvestsService } from './harvests.service.js';
import { HarvestsController } from './harvests.controller.js';

@Module({
  controllers: [HarvestsController],
  providers: [HarvestsService],
})
export class HarvestsModule {}
