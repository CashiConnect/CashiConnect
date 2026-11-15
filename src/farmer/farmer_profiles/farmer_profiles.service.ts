import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFarmerProfileDto } from './dto/create-farmer_profile.dto.js';
import { FarmerProfile } from './entities/farmer_profile.entity.js';
import { UpdateFarmerProfileDto } from './dto/update-farmer_profile.dto.js';

@Injectable()
export class FarmerProfilesService {
  constructor(
    @InjectRepository(FarmerProfile)
    private readonly farmerProfileRepository: Repository<FarmerProfile>,
  ) {}

  create(createDto: CreateFarmerProfileDto, userId: number) {
    const profile = this.farmerProfileRepository.create({
      ...createDto,
      user_id: userId,
    });

    return this.farmerProfileRepository.save(profile);
  }

  async findByUserId(userId: number) {
    const profile = await this.farmerProfileRepository.findOneBy({
      user_id: userId,
    });

    if (!profile) {
      throw new NotFoundException('Farmer profile not found');
    }

    return profile;
  }



  async updateProfile(dto: UpdateFarmerProfileDto, userId: number) {
    const profile=await this.farmerProfileRepository.findOne(
      {
        where: {
          user_id: userId,
        },
      }
    )
    if (!profile){
      throw new NotFoundException('Farmer profile not found');
    }else{}
    Object.assign(profile,dto);
    return this.farmerProfileRepository.save(profile);

  }



}
