import { InjectRepository } from '@nestjs/typeorm';
import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import {
    DataSource,
    EntityManager,
    FindOptionsWhere,
    ILike,
    Repository,
} from 'typeorm';
import { Land, type LandAvailability } from './entities/land.entity.js';
import { LandImage } from '../land-images/entities/land-image.entity.js';
import { CreateLandDto } from './dto/create-land.dto.js';
import { UpdateLandDto } from './dto/update-land.dto.js';
import { UpdateAvailabilityDto } from './dto/update-availability.dto.js';
import { QueryLandDto } from './dto/query-land.dto.js';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto.js';
import { LandownerProfilesService } from '../landowner-profiles/landowner-profiles.service.js';

@Injectable()
export class LandsService {
    constructor(
        @InjectRepository(Land)
        private readonly landRepository: Repository<Land>,
        private readonly landownerProfilesService: LandownerProfilesService,
        private readonly dataSource: DataSource,
    ) {}

    async create(dto: CreateLandDto, userId: number) {
        const profile = await this.landownerProfilesService.findByUserId(userId);

        const land = this.landRepository.create({
            ...dto,
            landowner_id: profile.id,
        });
        return await this.landRepository.save(land);
    }

    async findMyLands(userId: number, query: PaginationQueryDto) {
        const profile = await this.landownerProfilesService.findByUserId(userId);

        const [data, total] = await this.landRepository.findAndCount({
            where: { landowner_id: profile.id },
            order: { created_at: 'DESC' },
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

       async findAll(query: QueryLandDto, role: string) {
        const where: FindOptionsWhere<Land> = {};

        if (query.location) where.location = ILike(`%${query.location}%`);
        if (query.soil_type) where.soil_type = ILike(`%${query.soil_type}%`);

        if (role === 'Farmer') {
            where.availability_status = 'available';
        } else if (query.availability_status) {
            where.availability_status = query.availability_status;
        }

        const [data, total] = await this.landRepository.findAndCount({
            where,
            order: { created_at: 'DESC' },
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

    async findOne(id: number) {
        const land = await this.landRepository.findOneBy({ id });
        if (!land) {
            throw new NotFoundException('Land not found');
        }
        return land;
    }

    async update(id: number, dto: UpdateLandDto, userId: number) {
        const land = await this.findOwnedLand(id, userId);
        Object.assign(land, dto);
        return await this.landRepository.save(land);
    }

    async updateAvailability(id: number, dto: UpdateAvailabilityDto, userId: number) {
        const land = await this.findOwnedLand(id, userId);

        if (
            land.availability_status === 'reserved' ||
            land.availability_status === 'occupied'
        ) {
            throw new BadRequestException(
                `Land is ${land.availability_status} and cannot be changed now`,
            );
        }

        land.availability_status = dto.availability_status;
        return await this.landRepository.save(land);
    }

       async remove(id: number, userId: number) {
        const land = await this.findOwnedLand(id, userId);

        await this.dataSource.transaction(async (manager) => {
            await manager.delete(LandImage, { land_id: land.id });
            await manager.delete(Land, { id: land.id });
        });

        return { message: 'Land and its images deleted successfully' };
    }



    async findAvailableById(id: number) {
        const land = await this.findOne(id);
        if (land.availability_status !== 'available') {
            throw new BadRequestException('Land is not available');
        }
        return land;
    }

        async setAvailability(id: number, status: LandAvailability, manager?: EntityManager) {
        const repo = manager ? manager.getRepository(Land) : this.landRepository;
        const land = await repo.findOneBy({ id });
        if (!land) {
            throw new NotFoundException('Land not found');
        }
        land.availability_status = status;
        return await repo.save(land);
    }

       async findOwnedLand(id: number, userId: number) {
        const profile = await this.landownerProfilesService.findByUserId(userId);
        const land = await this.findOne(id);
        if (land.landowner_id !== profile.id) {
            throw new ForbiddenException('You can only manage your own land');
        }
        return land;
    }
}