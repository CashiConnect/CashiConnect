import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InvestmentsService } from '../investments/investments.service.js';
import { InvestmentTransaction } from './entities/investment-transaction.entity.js';
import { CreateInvestmentTransactionDto } from './dto/create-investment-transaction.dto.js';
import { UpdateInvestmentTransactionDto } from './dto/update-investment-transaction.dto.js';

@Injectable()
export class InvestmentTransactionsService {
  constructor(
    @InjectRepository(InvestmentTransaction)
    private readonly transactions: Repository<InvestmentTransaction>,
    private readonly investments: InvestmentsService,
  ) {}

  async create(dto: CreateInvestmentTransactionDto, userId: number) {
    const investment = await this.investments.findOne(dto.investmentId, userId, 'Investor');
    if (investment.status !== 'pending') {
      throw new BadRequestException('Payments can only be recorded for pending investments');
    }
    if (dto.amount > Number(investment.amount)) {
      throw new BadRequestException('Payment cannot exceed the investment amount');
    }
    const previous = await this.transactions.find({ where: { investmentId: investment.id } });
    const reservedCents = previous.filter((tx) => ['pending', 'success'].includes(tx.paymentStatus))
      .reduce((sum, tx) => sum + Math.round(Number(tx.amount) * 100), 0);
    if (reservedCents + Math.round(dto.amount * 100) > Math.round(Number(investment.amount) * 100)) {
      throw new BadRequestException('Total pending and successful payments exceed investment amount');
    }
    
  const existingTransaction = await this.transactions.findOneBy({
    transactionReference: dto.transactionReference,
  });

  if (existingTransaction) {
    throw new ConflictException('Transaction reference already exists');
  }

    // This records a payment claim, NOT a confirmed payment gateway transfer.
    // Only an Admin can mark the record as success after external verification.
    try {
      return await this.transactions.save(this.transactions.create({
        investmentId: investment.id, transactionReference: dto.transactionReference,
        amount: dto.amount.toFixed(2), paymentMethod: dto.paymentMethod,
        paymentStatus: 'pending', transactionDate: new Date(),
      }));
    } catch (error) {
      if ((error as { code?: string }).code === '23505') throw new ConflictException('Transaction reference already exists');
      throw error;
    }
  }

  async findMine(userId: number) {
    // The parent investment service filters by JWT user ownership.
    const myInvestments = await this.investments.findAll(userId, 'Investor');
    if (myInvestments.length === 0) return [];
    const ids = myInvestments.map((row) => row.id);
    return this.transactions.createQueryBuilder('tx')
      .where('tx.investment_id IN (:...ids)', { ids })
      .orderBy('tx.created_at', 'DESC')
      .getMany();
  }

  async forInvestment(id: number, userId: number) {
    await this.investments.findOne(id, userId, 'Investor');
    return this.transactions.find({ where: { investmentId: id }, order: { createdAt: 'DESC' } });
  }

  async update(id: number, dto: UpdateInvestmentTransactionDto) {
    const record = await this.transactions.findOneBy({ id });
    if (!record) throw new NotFoundException('Payment transaction not found');
    const transitions: Record<string, string[]> = {
      pending: ['pending', 'success', 'failed'],
      failed: ['failed', 'pending'],
      success: ['success', 'refunded'],
      refunded: ['refunded'],
    };
    if (!(transitions[record.paymentStatus] ?? []).includes(dto.paymentStatus)) {
      throw new BadRequestException('Invalid payment status transition');
    }
    const investment = await this.investments.findOne(record.investmentId, 0, 'Admin');
    if (investment.status === 'cancelled' && dto.paymentStatus === 'success') {
      throw new BadRequestException('Cannot confirm a payment for a cancelled investment');
    }
    record.paymentStatus = dto.paymentStatus;
    const saved = await this.transactions.save(record);
    const successful = await this.transactions.find({
      where: { investmentId: record.investmentId, paymentStatus: 'success' },
    });
    await this.investments.reconcilePaymentStatus(
      record.investmentId,
      successful.reduce((sum, tx) => sum + Math.round(Number(tx.amount) * 100), 0),
    );
    return saved;
  }
}
