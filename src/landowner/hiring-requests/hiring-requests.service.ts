import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    Injectable,
    Logger,
    NotFoundException,} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindOptionsWhere, Not, Repository } from 'typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import { fileURLToPath } from 'node:url';
import { HiringRequest, type HiringStatus } from './entities/hiring-request.entity.js';
import { Land } from '../lands/entities/land.entity.js';
import { FarmerProfile } from '../../farmer/farmer_profiles/entities/farmer_profile.entity.js';
import { User } from '../../users/entities/user.entity.js';
import { CreateHiringRequestDto } from './dto/create-hiring-request.dto.js';
import { UpdateHiringRequestDto } from './dto/update-hiring-request.dto.js';
import { RespondHiringRequestDto } from './dto/respond-hiring-request.dto.js';
import { QueryHiringRequestDto } from './dto/query-hiring-request.dto.js';
import { LandsService } from '../lands/lands.service.js';
import { LandownerProfilesService } from '../landowner-profiles/landowner-profiles.service.js';

const template = (name: string) =>
    fileURLToPath(new URL(`./templates/${name}.hbs`, import.meta.url));

@Injectable()
export class HiringRequestsService {
    private readonly logger = new Logger(HiringRequestsService.name);

    constructor(
        @InjectRepository(HiringRequest)
        private readonly hiringRequestRepository: Repository<HiringRequest>,
        
        @InjectRepository(FarmerProfile)
        private readonly farmerProfileRepository: Repository<FarmerProfile>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly landsService: LandsService,
        private readonly landownerProfilesService: LandownerProfilesService,
        private readonly dataSource: DataSource,
        private readonly mailerService: MailerService,
    ) {}

    async create(dto: CreateHiringRequestDto, userId: number) {
        const land = await this.landsService.findOwnedLand(dto.land_id, userId);
        if (land.availability_status !== 'available') {
            throw new BadRequestException(
                `Land is ${land.availability_status}; you can only hire for an available land`,
            );
        }

        const farmer = await this.farmerProfileRepository.findOneBy({
            id: dto.farmer_id,
        });

        if (!farmer) {
            throw new NotFoundException('Farmer not found');
        }

        const duplicate = await this.hiringRequestRepository.existsBy({
            farmer_id: dto.farmer_id,
            land_id: dto.land_id,
            status: 'pending',
        });

        if (duplicate) {
            throw new ConflictException(
                'A pending request for this farmer and land already exists',
            );
        }

        const request = await this.hiringRequestRepository.save(
            this.hiringRequestRepository.create({ ...dto, status: 'pending' }),
        );

        const farmerUser = await this.userRepository.findOneBy({ id: farmer.user_id });
        const landownerUser = await this.userRepository.findOneBy({ id: userId });

        if (farmerUser) {
            await this.sendMail(
                farmerUser.email,
                'New hiring request on CashiConnect',
                'hiring-request-received',
                {
                    farmerName: farmerUser.full_name,
                    landownerName: landownerUser?.full_name ?? 'A landowner',
                    jobTitle: request.job_title,
                    landName: land.land_name,
                    location: land.location,
                    salary: request.proposed_salary,
                },
            );
        }

        return request;
    }

    async update(id: number, dto: UpdateHiringRequestDto, userId: number) {
        const request = await this.findOwnedRequest(id, userId);
            this.assertStatus(request, ['pending'], 'Only a pending request can be edited');

        Object.assign(request, dto);
        return await this.hiringRequestRepository.save(request);
    }

    async cancel(id: number, userId: number) {
        const request = await this.findOwnedRequest(id, userId);
            this.assertStatus(request, ['pending'], 'Only a pending request can be cancelled');

        request.status = 'cancelled';
            return await this.hiringRequestRepository.save(request);
    }

    async complete(id: number, userId: number) {
        const request = await this.findOwnedRequest(id, userId);
            this.assertStatus(request, ['accepted'], 'Only an accepted request can be completed');

        await this.dataSource.transaction(async (manager) => {
            await manager.update(HiringRequest, request.id, { status: 'completed' });
            await this.landsService.setAvailability(request.land_id, 'available', manager);
        });

        return await this.findOwnedRequest(id, userId);
    }

    async remove(id: number, userId: number) {
        const request = await this.findOwnedRequest(id, userId);
         this.assertStatus(
            request,
            ['pending', 'cancelled', 'rejected'],
            'Accepted or completed requests are kept as history and cannot be deleted',
        );

        await this.hiringRequestRepository.remove(request);
        return { message: 'Hiring request deleted successfully' };
    }

    async respond(id: number, dto: RespondHiringRequestDto, userId: number) {
        const farmer = await this.getFarmerProfile(userId);

        const target = await this.hiringRequestRepository.findOneBy({ id });

        if (!target) {
            throw new NotFoundException('Hiring request not found');

        }
        if (target.farmer_id !== farmer.id) {
            throw new ForbiddenException('This request was not sent to you');
        }

        const result = await this.dataSource.transaction(async (manager) => {
            const land = await manager.findOne(Land, {
                where: { id: target.land_id },
                lock: { mode: 'pessimistic_write' },
            });

            if (!land) {
                throw new NotFoundException('Land not found');
            }

            const request = await manager.findOne(HiringRequest, {
                where: { id },
                lock: { mode: 'pessimistic_write' },
            });

            if (!request) {
                throw new NotFoundException('Hiring request not found');
            }

            if (request.status !== 'pending') {
                throw new ConflictException(`Request is already ${request.status}`);
            }

            if (dto.status === 'accepted') {
                if (land.availability_status !== 'available') {
                    throw new ConflictException('Land is no longer available');
                }

                land.availability_status = 'occupied';
                await manager.save(land);

                await manager.update(
                    HiringRequest,
                    { land_id: request.land_id, status: 'pending', id: Not(request.id) },
                    { status: 'rejected' },
                );
            }

            request.status = dto.status;
            return await manager.save(request);
        });

        await this.notifyLandowner(result.id);
        return result;
    }

    async findAll(query: QueryHiringRequestDto, userId: number, role: string) {
        const where: FindOptionsWhere<HiringRequest> = {};

        if (query.status) where.status = query.status;

        if (role === 'Landowner') {
            const profile = await this.landownerProfilesService.findByUserId(userId);
                where.land = { landowner_id: profile.id };
        } else {
            const farmer = await this.getFarmerProfile(userId);
                where.farmer_id = farmer.id;
        }

        const [data, total] = await this.hiringRequestRepository.findAndCount({
            where,
            relations: { land: true },
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

    async findOne(id: number, userId: number, role: string) {

        if (role === 'Landowner') {
            return await this.findOwnedRequest(id, userId);
        }

        const farmer = await this.getFarmerProfile(userId);
        const request = await this.hiringRequestRepository.findOne({
            where: { id },
            relations: { land: true },
        });

        if (!request) {
            throw new NotFoundException('Hiring request not found');
        }

        if (request.farmer_id !== farmer.id) {
            throw new ForbiddenException('This request was not sent to you');
        }
        return request;
    }

    private async findOwnedRequest(id: number, userId: number) {
        const profile = await this.landownerProfilesService.findByUserId(userId);
        const request = await this.hiringRequestRepository.findOne({
            where: { id },
            relations: { land: true },
        });

        if (!request) {
            throw new NotFoundException('Hiring request not found');
        }

        if (request.land.landowner_id !== profile.id) {
            throw new ForbiddenException('This request is not for your land');
        }
        return request;
    }

    private async getFarmerProfile(userId: number) {
        const farmer = await this.farmerProfileRepository.findOneBy({
            user_id: userId,
        });

        if (!farmer) {
            throw new NotFoundException('Farmer profile not found');
        }
        return farmer;
    }

    private assertStatus(request: HiringRequest, allowed: HiringStatus[], message: string) {

        if (!allowed.includes(request.status)) {
            throw new BadRequestException(
                `${message} (current status: ${request.status})`,
            );
        }
    }

    private async notifyLandowner(requestId: number) {
        const request = await this.hiringRequestRepository.findOne({
            where: { id: requestId },
            relations: { land: { landownerProfile: { user: true } } },
        });

        if (!request) return;

        const farmer = await this.farmerProfileRepository.findOneBy({
            id: request.farmer_id,
        });
        const farmerUser = farmer
            ? await this.userRepository.findOneBy({ id: farmer.user_id })
            : null;
        const landownerUser = request.land.landownerProfile.user;

        await this.sendMail(
            landownerUser.email,
            `Your hiring request was ${request.status}`,
            'hiring-request-responded',
            {
                landownerName: landownerUser.full_name,
                farmerName: farmerUser?.full_name ?? 'The farmer',
                status: request.status,
                jobTitle: request.job_title,
                  landName: request.land.land_name,
            },
        );
    }

    private async sendMail(
        to: string,
        subject: string,
        templateName: string,
        context: Record<string, unknown>,
    ) {
        try {
            await this.mailerService.sendMail({
                to,
                subject,
                template: template(templateName),
                context,
            });
        }
        catch (error) {
            this.logger.error(
                `Email "${subject}" could not be sent to ${to}`,
                error instanceof Error ? error.stack : String(error),
            );
        }
    }
}