
import * as typeorm from 'typeorm';

import { FarmingProjects } from '../../farming_projects/entities/farming_projects.entity.js';
import { Relation } from 'typeorm';
@typeorm.Entity('harvests')
export class Harvest {
  @typeorm.PrimaryGeneratedColumn()
  id: number;

@typeorm.ManyToOne(
  () => FarmingProjects,
  (project) => project.harvests,
  {
    nullable: false,
    onDelete: 'RESTRICT',
  },
)
@typeorm.JoinColumn({
  name: 'project_id',
  referencedColumnName: 'id',
})
project: typeorm.Relation<FarmingProjects>;

  @typeorm.Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
  })
  quantity: number;

  @typeorm.Column({
    type: 'varchar',
    length: 30,
  })
  unit: string;

  @typeorm.Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
  })
  sold_quantity: number;

  @typeorm.Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
  })
  selling_price_per_unit: number;

  @typeorm.Column({
    type: 'date',
  })
  harvest_date: Date;

  @typeorm.Column({
    type: 'text',
    nullable: true,
  })
  description: string | null;

  @typeorm.CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
  })
  created_at: Date;
}
