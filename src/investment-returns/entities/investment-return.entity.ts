
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  type Relation,
} from 'typeorm';

import { Investment } from '../../investments/entities/investment.entity.js';

@Entity('investment_returns')
export class InvestmentReturn {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'investment_id',
    type: 'int',
  })
  investmentId: number;

  @ManyToOne(
    () => Investment,
    (investment) => investment.returns,
    {
      onDelete: 'RESTRICT',
      nullable: false,
    },
  )
  @JoinColumn({ name: 'investment_id' })
  investment: Relation<Investment>;

  @Column({
    name: 'return_amount',
    type: 'decimal',
    precision: 12,
    scale: 2,
  })
  returnAmount: string;

  @Column({
    name: 'return_type',
    type: 'varchar',
    length: 30,
  })
  returnType: string;

  @Column({
    type: 'varchar',
    length: 30,
  })
  status: string;

  @Column({
    name: 'paid_at',
    type: 'timestamp',
    nullable: true,
  })
  paidAt: Date | null;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
  })
  createdAt: Date;
}
