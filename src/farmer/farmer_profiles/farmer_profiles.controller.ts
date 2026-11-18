import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js';
import { CreateFarmerProfileDto } from './dto/create-farmer_profile.dto.js';
import { FarmerProfilesService } from './farmer_profiles.service.js';
import { UpdateFarmerProfileDto } from './dto/update-farmer_profile.dto.js';
import { FarmerProfile } from './entities/farmer_profile.entity.js';
import { FarmerOnly } from '../../common/decorators/roles.decorator.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

type AuthenticatedRequest = Request & {
  user: {
    userId: number;
    email: string;
    role: string;
  };
};

@Controller('farmer-profiles')
@ApiTags('Farmer Profiles')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@FarmerOnly()
export class FarmerProfilesController {
  constructor(
    private readonly farmerProfilesService: FarmerProfilesService,
  ) {}

  @Post()
  create(
    @Body() createDto: CreateFarmerProfileDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.farmerProfilesService.create(createDto, req.user.userId);
  }
@Post('update')
  async updateProfile(@Body() updateDto: UpdateFarmerProfileDto, 
@Req() req: AuthenticatedRequest
): Promise<{message: string,farmerProfile: FarmerProfile}> {
  const updatefarmerProfile= await this.farmerProfilesService.updateProfile(updateDto, req.user.userId);
  if(!updatefarmerProfile){
    throw new BadRequestException('Failed to update farmer profile');
  }else{
    return{
      message: 'Farmer profile updated successfully',
      farmerProfile: updatefarmerProfile
    }

  }

  }

  @Get('me')
  findMyProfile(@Req() req: AuthenticatedRequest) {
    return this.farmerProfilesService.findByUserId(req.user.userId);
  }
}
