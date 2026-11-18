import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FarmerProfile } from '../farmer_profiles/entities/farmer_profile.entity.js';
import { CreateFarmingProjectDto } from './dto/create-farmer_projects.dto.js';
import { UpdateFarmingProjectDto } from './dto/update-farmer_projects.dto.js';
import { FarmingProjects } from './entities/farming_projects.entity.js';

@Injectable()
export class FarmingProjectsService {
  constructor(
    @InjectRepository(FarmingProjects)
    private readonly projectsRepository: Repository<FarmingProjects>,
    @InjectRepository(FarmerProfile)
    private readonly profilesRepository: Repository<FarmerProfile>,
  ) {}

  async create(dto: CreateFarmingProjectDto, userId: number) {
    this.ensureDateRange(dto.start_date, dto.end_date);

    const farmerProfile = await this.profilesRepository.findOneBy({ user_id: userId });
    if (!farmerProfile) {
      throw new NotFoundException('Create a farmer profile before creating a project');
    }

    const project = this.projectsRepository.create({
      ...dto,
      status: 'pending',
      farmerProfile,
    });
    return this.projectsRepository.save(project);
  }

  async findMine(userId: number) {
    const farmerProfile = await this.profilesRepository.findOneBy({ user_id: userId });
    if (!farmerProfile) throw new NotFoundException('Farmer profile not found');

    return this.projectsRepository.find({
      where: { farmerProfile: { id: farmerProfile.id } },
      order: { created_at: 'DESC' },
    });
  }

  findAll(status?: string) {
    return this.projectsRepository.find({
      where: status ? { status } : {},
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number) {
    const project = await this.projectsRepository.findOne({ where: { id } });
    if (!project) throw new NotFoundException('Farming project not found');
    return project;
  }

  async update(id: number, dto: UpdateFarmingProjectDto, userId: number) {
    const project = await this.findOwnedProject(id, userId);
    if (project.status !== 'pending') {
      throw new ForbiddenException('Only pending projects can be edited');
    }

    const startDate = dto.start_date ?? project.start_date.toISOString().slice(0, 10);
    const endDate = dto.end_date ?? project.end_date.toISOString().slice(0, 10);
    this.ensureDateRange(startDate, endDate);

    Object.assign(project, dto);
    return this.projectsRepository.save(project);
  }

  async remove(id: number, userId: number) {
    const project = await this.findOwnedProject(id, userId);
    if (project.status !== 'pending') {
      throw new ForbiddenException('Only pending projects can be deleted');
    }

    await this.projectsRepository.remove(project);
    return { message: 'Farming project deleted successfully' };
  }

  private async findOwnedProject(id: number, userId: number) {
    const project = await this.projectsRepository.findOne({
      where: { id },
      relations: { farmerProfile: true },
    });
    if (!project) throw new NotFoundException('Farming project not found');
    if (project.farmerProfile.user_id !== userId) {
      throw new ForbiddenException('You do not own this farming project');
    }
    return project;
  }

  private ensureDateRange(startDate: string, endDate: string) {
    if (new Date(startDate).getTime() > new Date(endDate).getTime()) {
      throw new BadRequestException('start_date must be before or equal to end_date');
    }
  }
}
