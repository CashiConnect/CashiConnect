import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('farmer_profiles')
export class FarmerProfile{
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
}
