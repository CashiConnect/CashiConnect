import {Body,
        Controller,
        Delete,
        Get,
        Param,
        ParseIntPipe,
        UseGuards,
        Patch,
        Post,
        Query,
  } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import {
       APP_ROLES,
       LandownerOnly,
       Roles,
  } from '../../common/decorators/roles.decorator.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto.js';
import { LandsService } from './lands.service.js';
import { CreateLandDto } from './dto/create-land.dto.js';
import { UpdateLandDto } from './dto/update-land.dto.js';
import { UpdateAvailabilityDto } from './dto/update-availability.dto.js';
import { QueryLandDto } from './dto/query-land.dto.js';

       @ApiTags('Lands')
       @ApiBearerAuth()
       @Controller('lands')
       @UseGuards(JwtAuthGuard, RolesGuard)    
              export class LandsController {
                 constructor(private readonly landsService: LandsService) {}

        @Post()
        @LandownerOnly()
        @ApiOperation({ summary: 'Add a new land' })
        async create(
            @Body() dto: CreateLandDto,
            @CurrentUser('userId') userId: number,
        ) {
            return await this.landsService.create(dto, userId);
        }

            @Get('my')
        @LandownerOnly()
        @ApiOperation({ summary: 'Get all my lands' })
        async findMyLands(
            @Query() query: PaginationQueryDto,
            @CurrentUser('userId') userId: number,
        ) {
            return await this.landsService.findMyLands(userId, query);
        }

        @Get()
        @Roles(APP_ROLES.FARMER, APP_ROLES.ADMIN)
        @ApiOperation({ summary: 'Search lands (location, soil type, availability)' })
        async findAll(
            @Query() query: QueryLandDto,
            @CurrentUser('role') role: string,
        ) {
            return await this.landsService.findAll(query, role);
        }

        @Get(':id')
        @ApiOperation({ summary: 'Get land details' })
        async findOne(@Param('id', ParseIntPipe) id: number) {
            return await this.landsService.findOne(id);
        }

        @Patch(':id/availability')
        @LandownerOnly()
        @ApiOperation({ summary: 'Change availability (available / unavailable)' })
        async updateAvailability(
            @Param('id', ParseIntPipe) id: number,
            @Body() dto: UpdateAvailabilityDto,
            @CurrentUser('userId') userId: number,
        ) {
            return await this.landsService.updateAvailability(id, dto, userId);
        }

        @Patch(':id')
        @LandownerOnly()
        @ApiOperation({ summary: 'Update my land' })
        async update(
            @Param('id', ParseIntPipe) id: number,
            @Body() dto: UpdateLandDto,
            @CurrentUser('userId') userId: number,
        ) {
            return await this.landsService.update(id, dto, userId);
        }

        @Delete(':id')
        @LandownerOnly()
        @ApiOperation({ summary: 'Delete my land (transaction)' })
        async remove(
            @Param('id', ParseIntPipe) id: number,
            @CurrentUser('userId') userId: number,
        ) {
            return await this.landsService.remove(id, userId);
        }
}
