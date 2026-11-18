
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

@Entity('investment_transactions')
export class InvestmentTransaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'investment_id',
    type: 'int',
  })
  investmentId: number;

  @ManyToOne(
    () => Investment,
    (investment) => investment.transactions,
    {
      onDelete: 'RESTRICT',
      nullable: false,
    },
  )
  @JoinColumn({ name: 'investment_id' })
  investment: Relation<Investment>;

  @Column({
    name: 'transaction_reference',
    type: 'varchar',
    length: 100,
    unique: true,
  })
  transactionReference: string;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
  })
  amount: string;

  @Column({
    name: 'payment_method',
    type: 'varchar',
    length: 50,
  })
  paymentMethod: string;

  @Column({
    name: 'payment_status',
    type: 'varchar',
    length: 30,
  })
  paymentStatus: string;

  @Column({
    name: 'transaction_date',
    type: 'timestamp',
  })
  transactionDate: Date;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
  })
  createdAt: Date;
}
