import {Body,
        Controller,
        Delete,
        Get,
        Post,
        Put,
        Param,
        Patch,
        ParseIntPipe,
        Query,
        UseGuards } from '@nestjs/common';
import { ApiBearerAuth,
         ApiConflictResponse,
         ApiForbiddenResponse,
         ApiNotFoundResponse,
         ApiOperation,
         ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { APP_ROLES,
         LandownerOnly,
         Roles } from '../../common/decorators/roles.decorator.js';
import { LandownerProfilesService } from './landowner-profiles.service.js';
import { CreateLandownerProfileDto } from './dto/create-landowner-profile.dto.js'; 
import { UpdateLandownerProfileDto } from './dto/update-landowner-profile.dto.js';
import {CurrentUser} from "../../common/decorators/current-user.decorator.js";
import {PaginationQueryDto} from "../../common/dto/pagination-query.dto.js";

@ApiTags('Landowner Profiles')
@ApiBearerAuth()
@Controller('landowner-profiles')
@UseGuards(JwtAuthGuard, RolesGuard)

export class LandownerProfilesController {
  constructor(private readonly landownerProfilesService: LandownerProfilesService) {}

  @Post()
  @LandownerOnly()
  @ApiOperation({ summary: 'Create a new landowner profile' })  
  async create(@Body() dto: CreateLandownerProfileDto,
         @CurrentUser('userId') userId: number) {
    return this.landownerProfilesService.create(dto, userId);
  }

  @Get()
  @Roles(APP_ROLES.ADMIN)
  @ApiOperation({ summary: 'Get all landowner (Admin)' })
  async findAll(@Query() query: PaginationQueryDto) {
    return this.landownerProfilesService.findAll(query);
  }

  @Get('me')
  @LandownerOnly()
  @ApiOperation({ summary: 'Update my landowner profile' })
  async findMyProfile(@CurrentUser('userId') userId: number) {
    return this.landownerProfilesService.findByUserId(userId);
  }

  @Patch(':id')
  @LandownerOnly()    
  @ApiOperation({ summary: 'Update my landowner profile' })
  async update(@Param('id', ParseIntPipe) id: number,
               @Body() dto: UpdateLandownerProfileDto,
               @CurrentUser('userId') userId: number) {

    return await this.landownerProfilesService.update(id, dto, userId);
  }

}