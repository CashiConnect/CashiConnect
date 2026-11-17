import {Column,
        Entity,
        CreateDateColumn,
        UpdateDateColumn,
        PrimaryGeneratedColumn,
        JoinColumn,
        OneToOne,
        type Relation} from 'typeorm';
import {User} from '../../../users/entities/user.entity.js';

@Entity('landowner_profiles')
export class LandownerProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  user_id: number;

  @OneToOne(() => User, { nullable:false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'user_id' })
  user: Relation<User>;

    @Column({ type: 'text' })       
    address: string;

    @Column({ type: 'varchar', length:100, nullable: true })
    occupation: string;

    @Column({ type: 'text', nullable: true })
    bio: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}