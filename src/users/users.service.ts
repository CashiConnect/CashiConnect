import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity.js';
import { UserQueryDto } from './dto/user-query.dto.js';


@Injectable()
export class UsersService {
  constructor( @InjectRepository(User)   private readonly userRepository: Repository<User>, ) {}

  
  async findAll({ page, limit, role, status }: UserQueryDto) {
    const [data, total] = await this.userRepository.findAndCount({
      where: {
        ...(status && { status }),
        ...(role && { role: { name: role } }),
      },
      relations: { role: true },
      select: {
        id: true,
        full_name: true,
        email: true,
        phone: true,
        status: true,
        created_at: true,
        updated_at: true,
        role: { id: true, name: true },
      },
      order: { id: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }
}