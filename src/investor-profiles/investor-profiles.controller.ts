import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { APP_ROLES, Roles } from '../common/decorators/roles.decorator.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { InvestorProfilesService } from './investor-profiles.service.js';
import { CreateInvestorProfileDto } from './dto/create-investor-profile.dto.js';
import { UpdateInvestorProfileDto } from './dto/update-investor-profile.dto.js';

@ApiTags('Investor Profiles')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('investor-profiles')
export class InvestorProfilesController {
  constructor(private readonly profiles: InvestorProfilesService) {}

  @Post() @Roles(APP_ROLES.INVESTOR)
  create(@Body() dto: CreateInvestorProfileDto, @CurrentUser('userId') userId: number) {
    return this.profiles.create(dto, userId);
  }

  @Get() @Roles(APP_ROLES.ADMIN)
  findAll() { return this.profiles.findAll(); }

  // Must precede ':id' to avoid treating 'me' as a numeric ID.
  @Get('me/portfolio') @Roles(APP_ROLES.INVESTOR)
  portfolio(@CurrentUser('userId') userId: number) { return this.profiles.portfolio(userId); }

  @Get(':id') @Roles(APP_ROLES.INVESTOR, APP_ROLES.ADMIN)
  findOne(@Param('id', ParseIntPipe) id: number,
          @CurrentUser('userId') userId: number, @CurrentUser('role') role: string) {
    return this.profiles.findOne(id, userId, role);
  }

  @Patch(':id') @Roles(APP_ROLES.INVESTOR)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateInvestorProfileDto,
         @CurrentUser('userId') userId: number) {
    return this.profiles.update(id, dto, userId);
  }
}
