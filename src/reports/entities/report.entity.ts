
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, type Relation,
} from 'typeorm';
import { User } from '../../users/entities/user.entity.js';
import { FarmingProjects } from '../../farmer/farming_projects/entities/farming_projects.entity.js';



@Entity('reports')
export class Report {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, { nullable: false, onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'reporter_id' })
    reporter: Relation<User>;

    @ManyToOne(() => User, { nullable: true, onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'reported_user_id' })
    reported_user: Relation<User> | null;

    @ManyToOne(() => FarmingProjects, { nullable: true, onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'project_id' })
    project: Relation<FarmingProjects> | null;

    @Column({ length: 150 })
    subject: string;

    @Column({ type: 'text' })
    description: string;

    @Column({ length: 30, default: 'pending' })
    status: string;

    @Column({ type: 'text', nullable: true })
    admin_note: string | null;

    @CreateDateColumn()
    created_at: Date;
}