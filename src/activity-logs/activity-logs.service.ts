import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { AdminActivityLog } from './entities/admin-activity-log.entity.js';


export type LogInput = {
  adminId: number;
  action: string;
  entityType: string;
  entityId: number;
};

@Injectable()
export class ActivityLogsService {
  constructor(
    @InjectRepository(AdminActivityLog)
    private readonly logRepository: Repository<AdminActivityLog>,
  ) {}

  log(input: LogInput, manager?: EntityManager) {
    const repo = manager
      ? manager.getRepository(AdminActivityLog)
      : this.logRepository;

    const entry = repo.create({
      admin: { id: input.adminId },
      action: input.action,
      entity_type: input.entityType,
      entity_id: input.entityId,
    });

    return repo.save(entry);
  }
}