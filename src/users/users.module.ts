import { Module } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { UsersController } from './users.controller.js';
import { User } from './entities/user.entity.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityLogsModule } from '../activity-logs/activity-logs.module.js';


@Module({
  
  imports: [TypeOrmModule.forFeature([User]), ActivityLogsModule],
  controllers: [UsersController],
  providers: [UsersService],
})

export class UsersModule {}