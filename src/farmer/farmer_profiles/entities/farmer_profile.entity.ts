import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { FarmingProjects } from '../../farming_projects/entities/farming_projects.entity.js';

@Entity('farmer_profiles')
export class FarmerProfile{
    [x: string]: any;
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    user_id: number;

    @Column()
    experience_years: number;
    @Column({
        type:'varchar',
        length: 100
    })
    specialization: string;
    @Column({
        type: 'text',
        nullable: true
    })
    bio: string;
    @Column({
        type: 'text'
    })
    address: string;
    @Column({
        type: 'varchar',
        length: 100,
        default: 'unverified'
    })   
    verification_status: string;
    @CreateDateColumn()
    created_at: Date;
    @UpdateDateColumn()
    updated_at: Date;

    @OneToMany(()=>FarmingProjects,(farmingProjects)=>farmingProjects.farmerProfile,{eager: true})
    farmingProjects: FarmingProjects[];
}
