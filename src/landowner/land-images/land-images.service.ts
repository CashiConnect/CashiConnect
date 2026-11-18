import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LandImage } from './entities/land-image.entity.js';
import { CreateLandImageDto } from './dto/create-land-image.dto.js';
import { UpdateLandImageDto } from './dto/update-land-image.dto.js';
import { LandsService } from '../lands/lands.service.js';
import { LandownerProfilesService } from '../landowner-profiles/landowner-profiles.service.js';

const MAX_IMAGES_PER_LAND = 10;

@Injectable()
export class LandImagesService {
    constructor(
        @InjectRepository(LandImage)
        private readonly landImageRepository: Repository<LandImage>,
        private readonly landsService: LandsService,
        private readonly landownerProfilesService: LandownerProfilesService,
    ) {}

    async create(dto: CreateLandImageDto, userId: number) {
        await this.landsService.findOwnedLand(dto.land_id, userId);

        const count = await this.landImageRepository.countBy({
            land_id: dto.land_id,
        });
        if (count >= MAX_IMAGES_PER_LAND) {
            throw new BadRequestException(
                `A land can have at most ${MAX_IMAGES_PER_LAND} images`,
            );
        }

        const image = this.landImageRepository.create(dto);
        return await this.landImageRepository.save(image);
    }

    async findByLand(landId: number) {
        await this.landsService.findOne(landId); 
        return await this.landImageRepository.find({
            where: { land_id: landId },
            order: { created_at: 'ASC' },
        });
    }

    async update(id: number, dto: UpdateLandImageDto, userId: number) {
        const image = await this.findOwnedImage(id, userId);
        image.image_url = dto.image_url;
        return await this.landImageRepository.save(image);
    }

    async remove(id: number, userId: number) {
        const image = await this.findOwnedImage(id, userId);
        await this.landImageRepository.remove(image);
        return { message: 'Image deleted successfully' };
    }

  
    private async findOwnedImage(id: number, userId: number) {
        const image = await this.landImageRepository.findOne({
            where: { id },
            relations: { land: true },
        });
        if (!image) {
            throw new NotFoundException('Image not found');
        }

        const profile = await this.landownerProfilesService.findByUserId(userId);
        if (image.land.landowner_id !== profile.id) {
            throw new ForbiddenException('You can only manage images of your own land',
            );
        }
        return image;
    }
}
