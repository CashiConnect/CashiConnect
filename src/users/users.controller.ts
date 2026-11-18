import { Body, Controller,Get,Param, ParseIntPipe, Patch, Query, UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service.js';
import { UserQueryDto } from './dto/user-query.dto.js';
import { UpdateUserStatusDto } from './dto/update-user-status.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { APP_ROLES, Roles } from '../common/decorators/roles.decorator.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(APP_ROLES.ADMIN)
  findAll(@Query() query: UserQueryDto) {
    return this.usersService.findAll(query);
  }

  @Patch(':id/status')
  @Roles(APP_ROLES.ADMIN)
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserStatusDto,
    @CurrentUser('userId') adminId: number,
  ) {
    return this.usersService.updateStatus(id, dto, adminId);
  }
}