
import * as typeorm from 'typeorm';

import { FarmingProjects } from '../../farming_projects/entities/farming_projects.entity.js';

@typeorm.Entity('project_updates')
export class ProjectUpdates {
  @typeorm.PrimaryGeneratedColumn()
  id: number;

 
  @typeorm.ManyToOne(() => FarmingProjects, (project) => project.projectUpdates, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @typeorm.JoinColumn({ name: 'project_id', referencedColumnName: 'id' })
  project: typeorm.Relation<FarmingProjects>;

  @typeorm.Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
  })
  progress_percentage: number;

  @typeorm.Column({
    type: 'varchar',
    length: 150,
  })
  milestone: string;

  @typeorm.Column({
    type: 'text',
  })
  description: string;

  @typeorm.Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
  })
  expense_amount: number;

  @typeorm.Column({
    type: 'timestamp',
  })
  update_date: Date;

  @typeorm.CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
  })
  created_at: Date;
}
