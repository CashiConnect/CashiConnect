import {Column,
        Entity,
        CreateDateColumn,
        UpdateDateColumn,
        PrimaryGeneratedColumn,
        JoinColumn,
        ManyToOne,
        type Relation,
        ValueTransformer,} from 'typeorm';
import {Land} from '../../lands/entities/land.entity.js';
import { FarmerProfile } from '../../../farmer/farmer_profiles/entities/farmer_profile.entity.js';

export const HIRING_STATUS = [   
    'pending',
    'accepted',
    'rejected', 
    'completed',
    'cancelled',
] as const;

export type HiringStatus = (typeof HIRING_STATUS)[number];

const decimalToNumber: ValueTransformer = {
    to: (value?: number | null) => value,
    from: (value?: string | null) =>
        value === null || value === undefined ? value : Number(value),
};

@Entity('hiring_requests')
export class HiringRequest{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  farmer_id: number;

  @ManyToOne(() => FarmerProfile,{
    nullable:false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'farmer_id' })
  farmerProfile: Relation<FarmerProfile>;

  @Column()
  land_id: number;

    @ManyToOne(() => Land,{
    nullable:false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'land_id' })
  land: Relation<Land>;

    @Column({ type: 'varchar', length:150 })
    job_title: string;

    @Column ({type :'text'})
    description: string;

    @Column({ type: 'decimal', precision: 12, scale: 2, transformer: decimalToNumber })
    proposed_salary: number;

   @Column({ type: 'varchar', length:20, default: 'pending' })
    status: HiringStatus;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

}