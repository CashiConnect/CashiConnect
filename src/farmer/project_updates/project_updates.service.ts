import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FarmingProjects } from '../farming_projects/entities/farming_projects.entity.js';
import { CreateProjectUpdateDto } from './dto/create-project_updates.dto.js';
import { UpdateProjectUpdateDto } from './dto/update-project_update.dto.js';
import { ProjectUpdates } from './entities/project_update.entity.js';

@Injectable()
export class ProjectUpdatesService {
  constructor(
    @InjectRepository(ProjectUpdates)
    private readonly updatesRepository: Repository<ProjectUpdates>,
    @InjectRepository(FarmingProjects)
    private readonly projectsRepository: Repository<FarmingProjects>,
  ) {}

  async create(dto: CreateProjectUpdateDto, userId: number) {
    const project = await this.findOwnedProject(dto.project_id, userId);
    const update = this.updatesRepository.create({
      progress_percentage: dto.progress_percentage,
      milestone: dto.milestone,
      description: dto.description,
      expense_amount: dto.expense_amount,
      update_date: dto.update_date as unknown as Date,
      project,
    });
    return this.updatesRepository.save(update);
  }

  async update(id: number, dto: UpdateProjectUpdateDto, userId: number) {
    const update = await this.findOwnedUpdate(id, userId);

    if (dto.project_id !== undefined && dto.project_id !== update.project.id) {
      update.project = await this.findOwnedProject(dto.project_id, userId);
    }
    if (dto.progress_percentage !== undefined) {
      update.progress_percentage = dto.progress_percentage;
    }
    if (dto.milestone !== undefined) update.milestone = dto.milestone;
    if (dto.description !== undefined) update.description = dto.description;
    if (dto.expense_amount !== undefined) update.expense_amount = dto.expense_amount;
    if (dto.update_date !== undefined) {
      update.update_date = dto.update_date as unknown as Date;
    }

    return this.updatesRepository.save(update);
  }

  async remove(id: number, userId: number) {
    const update = await this.findOwnedUpdate(id, userId);
    await this.updatesRepository.remove(update);
    return { message: 'Project update deleted successfully' };
  }

  async findTimeline(projectId: number) {
    const project = await this.projectsRepository.findOneBy({ id: projectId });
    if (!project) throw new NotFoundException('Farming project not found');
    return this.updatesRepository.find({
      where: { project: { id: projectId } },
      order: { update_date: 'ASC' },
    });
  }

  private async findOwnedProject(projectId: number, userId: number) {
    const project = await this.projectsRepository.findOne({
      where: { id: projectId },
      relations: { farmerProfile: true },
    });
    if (!project) throw new NotFoundException('Farming project not found');
    if (project.farmerProfile.user_id !== userId) {
      throw new ForbiddenException('You do not own this farming project');
    }
    return project;
  }

  private async findOwnedUpdate(id: number, userId: number) {
    const update = await this.updatesRepository.findOne({
      where: { id },
      relations: { project: { farmerProfile: true } },
    });
    if (!update) throw new NotFoundException('Project update not found');
    if (update.project.farmerProfile.user_id !== userId) {
      throw new ForbiddenException('You do not own this project update');
    }
    return update;
  }
}
