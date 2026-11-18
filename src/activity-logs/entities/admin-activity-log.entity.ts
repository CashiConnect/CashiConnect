
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, type Relation,
} from 'typeorm';
import { User } from '../../users/entities/user.entity.js';

@Entity('activity_log')
export class AdminActivityLog {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'admin_id' })
  admin: Relation<User>;

  @Column({ length: 100 })
  action: string;

  @Column({ length: 50 })
  entity_type: string;

  @Column()
  entity_id: number;

  @CreateDateColumn()
  created_at: Date;
}