import {Column,
        Entity,
        CreateDateColumn,
        UpdateDateColumn,
        PrimaryGeneratedColumn,
        JoinColumn,
        ManyToOne,
        type Relation} from 'typeorm';
import {Land} from '../../lands/entities/land.entity.js';

@Entity('land_images')
export class LandImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  land_id: number;

    @ManyToOne(() => Land, (land) => land.images, {
        nullable: false,
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'land_id' })
    land: Relation<Land>;

    @Column({ type: 'varchar', length: 255 })
    image_url: string;

    @CreateDateColumn()
    created_at: Date;
}