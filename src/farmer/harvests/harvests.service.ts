import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FarmingProjects } from '../farming_projects/entities/farming_projects.entity.js';
import { CreateHarvestDto } from './dto/create-harvest.dto.js';
import { UpdateHarvestDto } from './dto/update-harvest.dto.js';
import { Harvest } from './entities/harvests.entity.js';

@Injectable()
export class HarvestsService {
  constructor(
    @InjectRepository(Harvest)
    private readonly harvestsRepository: Repository<Harvest>,
    @InjectRepository(FarmingProjects)
    private readonly projectsRepository: Repository<FarmingProjects>,
  ) {}

  async create(dto: CreateHarvestDto, userId: number) {
    this.ensureSoldQuantity(dto.quantity, dto.sold_quantity);
    const project = await this.findOwnedProject(dto.project_id, userId);
    const harvest = this.harvestsRepository.create({
      quantity: dto.quantity,
      unit: dto.unit,
      sold_quantity: dto.sold_quantity,
      selling_price_per_unit: dto.selling_price_per_unit,
      harvest_date: dto.harvest_date as unknown as Date,
      description: dto.description ?? null,
      project,
    });
    return this.harvestsRepository.save(harvest);
  }

  async update(id: number, dto: UpdateHarvestDto, userId: number) {
    const harvest = await this.findOwnedHarvest(id, userId);

    // The project foreign key can only be changed to another project owned by this farmer.
    if (dto.project_id !== undefined && dto.project_id !== harvest.project.id) {
      harvest.project = await this.findOwnedProject(dto.project_id, userId);
    }

    const quantity = dto.quantity ?? Number(harvest.quantity);
    const soldQuantity = dto.sold_quantity ?? Number(harvest.sold_quantity);
    this.ensureSoldQuantity(quantity, soldQuantity);

    if (dto.quantity !== undefined) harvest.quantity = dto.quantity;
    if (dto.unit !== undefined) harvest.unit = dto.unit;
    if (dto.sold_quantity !== undefined) harvest.sold_quantity = dto.sold_quantity;
    if (dto.selling_price_per_unit !== undefined) {
      harvest.selling_price_per_unit = dto.selling_price_per_unit;
    }
    if (dto.harvest_date !== undefined) {
      harvest.harvest_date = dto.harvest_date as unknown as Date;
    }
    if (dto.description !== undefined) harvest.description = dto.description;

    return this.harvestsRepository.save(harvest);
  }

  async remove(id: number, userId: number) {
    const harvest = await this.findOwnedHarvest(id, userId);
    await this.harvestsRepository.remove(harvest);
    return { message: 'Harvest record deleted successfully' };
  }

  private async findOwnedHarvest(id: number, userId: number) {
    const harvest = await this.harvestsRepository.findOne({
      where: { id },
      relations: { project: { farmerProfile: true } },
    });
    if (!harvest) throw new NotFoundException('Harvest record not found');
    if (harvest.project.farmerProfile.user_id !== userId) {
      throw new ForbiddenException('You do not own this harvest record');
    }
    return harvest;
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

  private ensureSoldQuantity(quantity: number, soldQuantity: number) {
    if (soldQuantity > quantity) {
      throw new BadRequestException('sold_quantity cannot exceed quantity');
    }
  }
}
