
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  type Relation,
} from 'typeorm';

import { InvestorProfile } from '../../investor-profiles/entities/investor-profile.entity.js';

import { FarmingProjects } from '../../farmer/farming_projects/entities/farming_projects.entity.js';

import { InvestmentTransaction } from '../../investment-transactions/entities/investment-transaction.entity.js';

import { InvestmentReturn } from '../../investment-returns/entities/investment-return.entity.js';

@Entity('investments')
export class Investment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'investor_id',
    type: 'int',
  })
  investorId: number;

  @ManyToOne(
    () => InvestorProfile,
    (investor) => investor.investments,
    {
      onDelete: 'RESTRICT',
      nullable: false,
    },
  )
  @JoinColumn({ name: 'investor_id' })
  investor: Relation<InvestorProfile>;

  @Column({
    name: 'project_id',
    type: 'int',
  })
  projectId: number;

  @ManyToOne(() => FarmingProjects, {
    onDelete: 'RESTRICT',
    nullable: false,
  })
  @JoinColumn({ name: 'project_id' })
  project: Relation<FarmingProjects>;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
  })
  amount: string;

  @Column({
    type: 'varchar',
    length: 30,
  })
  status: string;

  @Column({
    name: 'invested_at',
    type: 'timestamp',
  })
  investedAt: Date;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
  })
  createdAt: Date;

  @OneToMany(
    () => InvestmentTransaction,
    (transaction) => transaction.investment,
  )
  transactions: Relation<InvestmentTransaction[]>;

  @OneToMany(
    () => InvestmentReturn,
    (investmentReturn) => investmentReturn.investment,
  )
  returns: Relation<InvestmentReturn[]>;
}
