import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn, type Relation } from "typeorm";
import {FarmerProfile} from "../../farmer_profiles/entities/farmer_profile.entity.js";
import { Harvest } from "../../harvests/entities/harvests.entity.js";
import { ProjectUpdates } from "../../project_updates/entities/project_update.entity.js";

@Entity('farming_projects')
export class FarmingProjects{
    @PrimaryGeneratedColumn()
    id:number;
    @Column({
        nullable: true,
        type:'varchar',
        length: 150
    })
    title:string;
    @Column({
        type:'varchar',
        length: 100
    })
    crop_name:string;
    @Column({
        type:'varchar',
        length: 100
    })
    description:string;
    @Column({
        type:'decimal',
        precision: 12,
        scale: 2
    })
    required_funding:number;
    @Column({
        type:'date'
    })
    start_date:Date;
    @Column({
        type:'date'
        
    })
    end_date:Date;

    @Column({ type: 'varchar',
         length: 20,
          default: 'open' })
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

 @OneToMany(
  () => Harvest,
  (harvest) => harvest.project,
)
harvests: Relation<Harvest[]>;



@OneToMany(
  () => ProjectUpdates,
  (projectUpdate) => projectUpdate.project,
)
projectUpdates: Relation<ProjectUpdates[]>;

  @ManyToOne(()=>FarmerProfile
,(farmerProfile)=>farmerProfile.farmingProjects,{nullable:false,onDelete:'CASCADE'})
@JoinColumn({name:'farmer_id',referencedColumnName:'id'}  )
farmerProfile: Relation<FarmerProfile>;


  


}
