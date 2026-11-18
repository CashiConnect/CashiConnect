
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { InvestorProfilesService } from '../investor-profiles/investor-profiles.service.js';
import { FarmingProjectsService } from '../farmer/farming_projects/farming_projects.service.js';
import { Investment } from './entities/investment.entity.js';
import { CreateInvestmentDto } from './dto/create-investment.dto.js';
import { UpdateInvestmentDto } from './dto/update-investment.dto.js';

@Injectable()
export class InvestmentsService {
  constructor(
    @InjectRepository(Investment)
    private readonly investments: Repository<Investment>,
    private readonly profiles: InvestorProfilesService,
    private readonly farmingProjects: FarmingProjectsService,
  ) {}

  async create(dto: CreateInvestmentDto, userId: number) {
    const profile = await this.profiles.findByUserId(userId);

    const project = await this.farmingProjects.findOne(dto.projectId);

    if (!['approved', 'active'].includes(project.status)) {
      throw new BadRequestException(
        'Investments are allowed only for approved or active projects',
      );
    }

    return this.investments.save(
      this.investments.create({
        investorId: profile.id,
        projectId: project.id,
        amount: dto.amount.toFixed(2),
        status: 'pending',
        investedAt: new Date(),
      }),
    );
  }

  async findAll(userId: number, role: string) {
    if (role === 'Admin') {
      return this.investments.find({
        order: { createdAt: 'DESC' },
      });
    }

    const profile = await this.profiles.findByUserId(userId);

    return this.investments.find({
      where: { investorId: profile.id },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number, userId: number, role: string) {
    const investment = await this.investments.findOneBy({ id });

    if (!investment) {
      throw new NotFoundException('Investment not found');
    }

    if (role !== 'Admin') {
      const profile = await this.profiles.findByUserId(userId);

      if (investment.investorId !== profile.id) {
        throw new ForbiddenException('Not your investment');
      }
    }

    return investment;
  }

  async cancel(id: number, userId: number) {
    const investment = await this.findOne(
      id,
      userId,
      'Investor',
    );

    if (investment.status !== 'pending') {
      throw new BadRequestException(
        'Only pending investments can be cancelled',
      );
    }

    investment.status = 'cancelled';

    return this.investments.save(investment);
  }

  async update(id: number, dto: UpdateInvestmentDto) {
    const investment = await this.investments.findOneBy({ id });

    if (!investment) {
      throw new NotFoundException('Investment not found');
    }

    investment.status = dto.status;

    return this.investments.save(investment);
  }

  async projectInvestors(
    projectId: number,
    userId: number,
    role: string,
  ) {
    await this.farmingProjects.findOne(projectId);

    if (role === 'Farmer') {
      const mine = await this.farmingProjects.findMine(userId);

      if (!mine.some((project) => project.id === projectId)) {
        throw new ForbiddenException(
          'You do not own this farming project',
        );
      }
    }

    const rows = await this.investments.find({
      where: { projectId },
      order: { createdAt: 'DESC' },
    });

    const confirmed = rows.filter((row) =>
      ['confirmed', 'completed'].includes(row.status),
    );

    return {
      projectId,
      investorCount: new Set(
        rows.map((row) => row.investorId),
      ).size,
      totalConfirmedFunding: (
        confirmed.reduce(
          (sum, row) =>
            sum + Math.round(Number(row.amount) * 100),
          0,
        ) / 100
      ).toFixed(2),
      investments: rows.map(
        ({ id, investorId, amount, status, investedAt }) => ({
          id,
          investorId,
          amount,
          status,
          investedAt,
        }),
      ),
    };
  }

  async findByProject(projectId: number) {
    return this.investments.find({
      where: { projectId },
    });
  }

  // Called after Admin confirms a transaction.
  // Investor cannot call this method directly.
  async reconcilePaymentStatus(
    investmentId: number,
    successfulTotalCents: number,
  ) {
    const investment = await this.investments.findOneBy({
      id: investmentId,
    });

    if (!investment) {
      throw new NotFoundException('Investment not found');
    }

    if (
      investment.status === 'cancelled' ||
      investment.status === 'completed'
    ) {
      return investment;
    }

    const requiredCents = Math.round(
      Number(investment.amount) * 100,
    );

    const next =
      successfulTotalCents >= requiredCents
        ? 'confirmed'
        : 'pending';

    if (investment.status !== next) {
      investment.status = next;
      await this.investments.save(investment);
    }

    return investment;
  }
}
