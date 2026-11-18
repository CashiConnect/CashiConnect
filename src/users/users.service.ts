import {
  BadRequestException, ConflictException, Injectable, NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from './entities/user.entity.js';
import { UserQueryDto } from './dto/user-query.dto.js';
import { UpdateUserStatusDto } from './dto/update-user-status.dto.js';
import { ActivityLogsService } from '../activity-logs/activity-logs.service.js';



@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource,
    private readonly activityLogsService: ActivityLogsService,
  ) { }



 async findAll({ role, status }: UserQueryDto) {
  const data = await this.userRepository.find({
    where: {
      ...(status && { status }),
      ...(role && { role: { name: role } }),
    },
    relations: { role: true },
    select: {
      id: true,
      full_name: true, 
      email: true, 
      phone: true,
      status: true, 
      created_at: true, 
      updated_at: true,
      role: { id: true, name: true },
    },
    order: { id: 'ASC' },
  });
  return { total: data.length, data };
}


  async updateStatus(id: number, dto: UpdateUserStatusDto, adminId: number) {
    if(id === adminId) {
      throw new BadRequestException('You cannot change your own status');
    }

    return this.dataSource.transaction( async (manager) => {
      const user = await manager.findOne(User, {
        where: { id },
        select: { id: true, status: true },
      });

      if(!user) {
        throw new NotFoundException(`User with id ${id} not found`);
      }

      if (user.status === dto.status) {
        throw new ConflictException(`User is already ${dto.status}`);
      }

      await manager.update(User, { id }, { status: dto.status });

      await this.activityLogsService.log(
        {
          adminId,
          action: `User status changed: ${user.status} -> ${dto.status}`,
          entityType: 'user',
          entityId: id,
        },
        manager,
      );

      return { id, status: dto.status };
    });
  }

}