
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  type Relation,
} from 'typeorm';

import { User } from '../../users/entities/user.entity.js';
import { Investment } from '../../investments/entities/investment.entity.js';

@Entity('investor_profiles')
export class InvestorProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'user_id',
    type: 'int',
    unique: true,
  })
  userId: number;

  @OneToOne(() => User, {
    onDelete: 'RESTRICT',
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: Relation<User>;

  @Column({ type: 'text' })
  address: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  occupation: string | null;

  @Column({
    name: 'investment_interest',
    type: 'varchar',
    length: 150,
    nullable: true,
  })
  investmentInterest: string | null;

  @Column({
    type: 'text',
    nullable: true,
  })
  bio: string | null;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
  })
  updatedAt: Date;

  @OneToMany(
    () => Investment,
    (investment) => investment.investor,
  )
  investments: Relation<Investment[]>;
}
