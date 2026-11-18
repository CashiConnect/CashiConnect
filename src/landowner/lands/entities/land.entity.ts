import {Column,
        Entity,
        CreateDateColumn,
        UpdateDateColumn,
        PrimaryGeneratedColumn,
        JoinColumn,
        ManyToOne,
        type Relation,
        ValueTransformer,
        OneToMany} from 'typeorm';
import { LandownerProfile } from '../../landowner-profiles/entities/landowner-profile.entity.js';
import {LandImage} from '../../land-images/entities/land-image.entity.js';

export const LAND_AVAILABILITY = [   
    'available',
    'unavailable',
    'occupied',
    'reserved',
] as const;

export type LandAvailability = (typeof LAND_AVAILABILITY)[number];

const decimalToNumber: ValueTransformer = {
    to: (value: number|null) => value,
    from: (value: string|null) => 
        value === null || value === undefined ? value : Number(value),
};

@Entity('lands')
export class Land {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  landowner_id: number;

  @ManyToOne(() => LandownerProfile, (profile)=>profile.lands,{
    nullable:false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'landowner_id' })
  landownerProfile: Relation<LandownerProfile>;

    @Column({ type: 'varchar', length:150 })
    land_name: string;

    @Column({ type: 'varchar', length:200 })
    location: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, transformer: decimalToNumber })
    land_size: number;

   @Column({ type: 'varchar', length:20 })
    size_unit: string;

    @Column({ type: 'varchar', length:100 })
    soil_type: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, transformer: decimalToNumber })
    rental_price: number;

    @Column ({type :'text', nullable:true})
    description: string;

    @Column({ type: 'varchar', length: 30, default: 'available' })
    availability_status: LandAvailability;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @OneToMany(() => LandImage, (image) => image.land)
    images: Relation<LandImage[]>;
}