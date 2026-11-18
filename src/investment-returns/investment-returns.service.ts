
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { InvestmentsService } from '../investments/investments.service.js';
import { InvestmentReturn } from './entities/investment-return.entity.js';
import { CreateInvestmentReturnDto } from './dto/create-investment-return.dto.js';
import { UpdateInvestmentReturnDto } from './dto/update-investment-return.dto.js';

@Injectable()
export class InvestmentReturnsService {
  constructor(
    @InjectRepository(InvestmentReturn)
    private readonly returns: Repository<InvestmentReturn>,

    private readonly investments: InvestmentsService,
  ) {}

  async create(dto: CreateInvestmentReturnDto) {
    const investment = await this.investments.findOne(
      dto.investmentId,
      0,
      'Admin',
    );

    if (!['confirmed', 'completed'].includes(investment.status)) {
      throw new BadRequestException(
        'Returns require a confirmed or completed investment',
      );
    }

    return this.returns.save(
      this.returns.create({
        investmentId: dto.investmentId,
        returnAmount: dto.returnAmount.toFixed(2),
        returnType: dto.returnType,
        status: 'pending',
        paidAt: null,
      }),
    );
  }

  async update(id: number, dto: UpdateInvestmentReturnDto) {
    const record = await this.returns.findOneBy({ id });

    if (!record) {
      throw new NotFoundException('Investment return not found');
    }

    if (record.status !== 'pending') {
      throw new BadRequestException(
        'Only pending return records can be updated',
      );
    }

    if (dto.returnAmount !== undefined) {
      record.returnAmount = dto.returnAmount.toFixed(2);
    }

    if (dto.status !== undefined) {
      record.status = dto.status;

      if (dto.status === 'paid') {
        record.paidAt = new Date();
      }
    }

    return this.returns.save(record);
  }

  async findMine(userId: number) {
    const mine = await this.investments.findAll(
      userId,
      'Investor',
    );

    if (mine.length === 0) {
      return [];
    }

    return this.returns
      .createQueryBuilder('ret')
      .where('ret.investment_id IN (:...ids)', {
        ids: mine.map((investment) => investment.id),
      })
      .orderBy('ret.created_at', 'DESC')
      .getMany();
  }

  async forInvestment(id: number, userId: number) {
    await this.investments.findOne(id, userId, 'Investor');

    return this.returns.find({
      where: { investmentId: id },
      order: { createdAt: 'DESC' },
    });
  }

  async distributeAfterHarvest(projectId: number) {
    // Requires verified harvest profit data from Farmer service.
    // Do not create financial returns without verified calculations.
    throw new NotImplementedException(
      `Return distribution for project ${projectId} requires a verified harvest profit summary from the Farmer service`,
    );
  }
}
