import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Role } from '../../roles/entities/roles.entity.js';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Role, (role) => role.users, {
    nullable: false,
  })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @Column({ length: 100 })
  full_name: string;

  @Column({ unique: true, length: 150 })
  email: string;

  @Column({ length: 255 })
  password: string;

  @Column({ unique: true, length: 20 })
  phone: string;

  @Column({ length: 20, default: 'active' })
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}