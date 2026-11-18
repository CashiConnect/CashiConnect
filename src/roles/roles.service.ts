import { ConflictException, ForbiddenException, Injectable, NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/roles.entity.js';
import { User } from '../users/entities/user.entity.js';
import { CreateRoleDto } from './dto/create-role.dto.js';
import { UpdateRoleDto } from './dto/update-role.dto.js';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto.js';




@Injectable()
export class RolesService {
  
    constructor( @InjectRepository(Role)  private readonly roleRepository: Repository<Role>,) {}


  async create(dto: CreateRoleDto) {
    const exists = await this.roleRepository.findOneBy({ name: dto.name });
    if(exists) {
      throw new ConflictException('Role name already exists');
    }
    const role = this.roleRepository.create(dto);
    return this.roleRepository.save(role);
  }


  async findAll({ page, limit }: PaginationQueryDto) {
    const [data, total] = await this.roleRepository.findAndCount({
      order: { id: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }



  async findOne(id: number) {
    const role = await this.roleRepository.findOneBy({ id });
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    return role;
  }


}