import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InvestorProfile } from './entities/investor-profile.entity.js';
import { CreateInvestorProfileDto } from './dto/create-investor-profile.dto.js';
import { UpdateInvestorProfileDto } from './dto/update-investor-profile.dto.js';

@Injectable()
export class InvestorProfilesService {
  constructor(@InjectRepository(InvestorProfile) private readonly profiles: Repository<InvestorProfile>) {}

  async create(dto: CreateInvestorProfileDto, userId: number) {
  if (await this.profiles.existsBy({ userId })) {
      throw new ConflictException('Investor profile already exists for this user');
    }
    try {
      return await this.profiles.save(this.profiles.create({
        userId, address: dto.address, occupation: dto.occupation ?? null,
        investmentInterest: dto.investmentInterest ?? null, bio: dto.bio ?? null,
      }));
    } catch (error) {
      if ((error as { code?: string }).code === '23505') throw new ConflictException('Investor profile already exists');
      throw error;
    }
  }

  findAll() {
    return this.profiles.find({ order: { id: 'DESC' } });
  }

  async findByUserId(userId: number) {
    const profile = await this.profiles.findOneBy({ userId });
    if (!profile) throw new NotFoundException('Investor profile not found');
    return profile;
  }

  async findOne(id: number, userId: number, role: string) {
    const profile = await this.profiles.findOneBy({ id });
    if (!profile) throw new NotFoundException('Investor profile not found');
    if (role !== 'Admin' && profile.userId !== userId) {
      throw new ForbiddenException('You can only view your own investor profile');
    }
    return profile;
  }

  async update(id: number, dto: UpdateInvestorProfileDto, userId: number) {
    const profile = await this.findOne(id, userId, 'Investor');
    Object.assign(profile, dto);
    return this.profiles.save(profile);
  }

  async portfolio(userId: number) {
    const profile = await this.findByUserId(userId);
    const record = await this.profiles.findOne({
      where: { id: profile.id },
      relations: { investments: { returns: true } },
    });
    const investments = record?.investments ?? [];
    const toCents = (value: string | number) => Math.round(Number(value) * 100);
    const invested = investments.filter((i) => i.status !== 'cancelled')
      .reduce((total, i) => total + toCents(i.amount), 0);
    const paidReturns = investments.flatMap((i) => i.returns ?? []).filter((r) => r.status === 'paid');
    const returned = paidReturns.reduce((total, r) => total + toCents(r.returnAmount), 0);
    const profit = paidReturns.filter((r) => r.returnType === 'profit')
      .reduce((total, r) => total + toCents(r.returnAmount), 0);
    return {
      investorProfileId: profile.id,
      investmentCount: investments.length,
      totalInvested: (invested / 100).toFixed(2),
      totalPaidReturns: (returned / 100).toFixed(2),
      totalPaidProfit: (profit / 100).toFixed(2),
    };
  }
}
