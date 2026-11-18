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
import {LandownerOnly} from '../../common/decorators/roles.decorator.js';
import {CurrentUser} from "../../common/decorators/current-user.decorator.js";
import {LandImagesService} from "./land-images.service.js";
import {CreateLandImageDto} from "./dto/create-land-image.dto.js";
import {UpdateLandImageDto} from "./dto/update-land-image.dto.js";

@ApiTags('Land Images')
@ApiBearerAuth()
@Controller('land-images')
@UseGuards(JwtAuthGuard, RolesGuard)

export class LandImagesController {
    constructor(private readonly landImagesService: LandImagesService) {}

@Post('land-images')
@LandownerOnly()
@ApiOperation({ summary: 'Add a new image to my land' })
async create(
    @Body() dto: CreateLandImageDto,
    @CurrentUser('userId') userId: number,
) {
    return await this.landImagesService.create(dto, userId);
}

@Get('land/:id/images')
@LandownerOnly()
@ApiOperation({ summary: 'Get all images of a land' })
async findByLand(@Param('id', ParseIntPipe) landId: number) {
    return await this.landImagesService.findByLand(landId);
}

@Patch('land-images/:id')
@LandownerOnly()
@ApiOperation({ summary: 'Update an image URL' })
async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateLandImageDto,
    @CurrentUser('userId') userId: number,
) {
    return await this.landImagesService.update(id, dto, userId);
}

@Delete('land-images/:id')
@LandownerOnly()
@ApiOperation({ summary: 'Delete an image' })
async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('userId') userId: number,
) {
    return await this.landImagesService.remove(id, userId);
}
}
