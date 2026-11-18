import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    UseGuards,} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import {
    APP_ROLES,
    FarmerOnly,
    LandownerOnly,
    Roles,} from '../../common/decorators/roles.decorator.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { HiringRequestsService } from './hiring-requests.service.js';
import { CreateHiringRequestDto } from './dto/create-hiring-request.dto.js';
import { UpdateHiringRequestDto } from './dto/update-hiring-request.dto.js';
import { RespondHiringRequestDto } from './dto/respond-hiring-request.dto.js';
import { QueryHiringRequestDto } from './dto/query-hiring-request.dto.js';


    @ApiTags('Hiring Requests')
    @ApiBearerAuth()
    @Controller('hiring-requests')
    @UseGuards(JwtAuthGuard, RolesGuard)

    export class HiringRequestsController {
        constructor(private readonly hiringRequestsService: HiringRequestsService) {}

    @Post()
    @LandownerOnly()
    @ApiOperation({ summary: 'Send a hiring request to a farmer (emails the farmer)' })
    async create(
        @Body() dto: CreateHiringRequestDto,
        @CurrentUser('userId') userId: number,
    ) {
        return await this.hiringRequestsService.create(dto, userId);
    }


    @Get()
    @Roles(APP_ROLES.LANDOWNER, APP_ROLES.FARMER)
    @ApiOperation({ summary: 'Landowner: requests I sent. Farmer: requests I received' })
    async findAll(
        @Query() query: QueryHiringRequestDto,
        @CurrentUser('userId') userId: number,
        @CurrentUser('role') role: string,
    ) {
        return await this.hiringRequestsService.findAll(query, userId, role);
    }

    @Get(':id')
    @Roles(APP_ROLES.LANDOWNER, APP_ROLES.FARMER)
    @ApiOperation({ summary: 'Get one hiring request' })
    async findOne(
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser('userId') userId: number,
        @CurrentUser('role') role: string,
    ) {
        return await this.hiringRequestsService.findOne(id, userId, role);
    }

        @Patch(':id/respond')
        @FarmerOnly()
        @ApiOperation({ summary: 'Accept or reject (transaction: land becomes occupied on accept)' })
        async respond(
            @Param('id', ParseIntPipe) id: number,
            @Body() dto: RespondHiringRequestDto,
            @CurrentUser('userId') userId: number,
        ) {
            return await this.hiringRequestsService.respond(id, dto, userId);
        }

        @Patch(':id/cancel')
        @LandownerOnly()
        @ApiOperation({ summary: 'Cancel a pending request' })
        async cancel(
            @Param('id', ParseIntPipe) id: number,
            @CurrentUser('userId') userId: number,
        ) {
            return await this.hiringRequestsService.cancel(id, userId);
        }

        @Patch(':id/complete')
        @LandownerOnly()
        @ApiOperation({ summary: 'Mark accepted job completed (transaction: land becomes available)' })
        async complete(
            @Param('id', ParseIntPipe) id: number,
            @CurrentUser('userId') userId: number,
        ) {
            return await this.hiringRequestsService.complete(id, userId);
        }

        @Patch(':id')
        @LandownerOnly()
        @ApiOperation({ summary: 'Edit a pending request' })
        async update(
            @Param('id', ParseIntPipe) id: number,
            @Body() dto: UpdateHiringRequestDto,
            @CurrentUser('userId') userId: number,
        ) {
            return await this.hiringRequestsService.update(id, dto, userId);
        }

        @Delete(':id')
        @LandownerOnly()
        @ApiOperation({ summary: 'Delete a pending, cancelled or rejected request' })
        async remove(
            @Param('id', ParseIntPipe) id: number,
            @CurrentUser('userId') userId: number,
        ) {
            return await this.hiringRequestsService.remove(id, userId);
        }
}