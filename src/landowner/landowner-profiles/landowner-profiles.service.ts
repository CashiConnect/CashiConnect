import {ConflictException,ForbiddenException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {LandownerProfile} from './entities/landowner-profile.entity.js';
import {CreateLandownerProfileDto} from './dto/create-landowner-profile.dto.js';
import {UpdateLandownerProfileDto} from './dto/update-landowner-profile.dto.js';
import {PaginationQueryDto} from '../../common/dto/pagination-query.dto.js';

    

@Injectable()
export class LandownerProfilesService {
  constructor(
    @InjectRepository(LandownerProfile)
    private readonly landownerProfileRepository: Repository<LandownerProfile>,
  ) {}

  async create(dto: CreateLandownerProfileDto, userId: number) {
    const existingProfile = await this.landownerProfileRepository.findOne({where:{ user_id:userId }});
    if (existingProfile) {
      throw new ConflictException('Landowner profile already exists');
    }

    const profile = this.landownerProfileRepository.create({ ...dto, user_id:userId });
    return await this.landownerProfileRepository.save(profile);
  }

  async findAll(query: PaginationQueryDto) {
    const [data, total] = await this.landownerProfileRepository.findAndCount({ 
        relations: {user: true},
        order: {created_at: 'DESC'}, 
        skip: (query.page - 1) * query.limit,
        take: query.limit,

     });
    return {
        data,
        meta: {
            page: query.page,
            limit: query.limit,
            total,
            totalPages: Math.ceil(total / query.limit),
        },
    };
  }

  async findByUserId(userId: number) {
    const profile = await this.landownerProfileRepository.findOneBy({user_id:userId});
    if (!profile) {
      throw new NotFoundException('Landowner profile not found');
    }
    return profile;
  }

  async update(id: number, dto: UpdateLandownerProfileDto, userId: number) {
    const profile = await this.landownerProfileRepository.findOneBy({id});
    if (!profile) {
      throw new NotFoundException('Landowner profile not found');
    }
    if (profile.user_id !== userId) {
      throw new ForbiddenException('You are not allowed to update this profile');
    }

    Object.assign(profile, dto);
    return await this.landownerProfileRepository.save(profile);
  } 

}