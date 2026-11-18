import {IsIn, 
        IsOptional, 
        IsString,} from 'class-validator';
import {ApiPropertyOptional} from '@nestjs/swagger';
import {LAND_AVAILABILITY} from '../entities/land.entity.js';
import{PaginationQueryDto} from '../../../common/dto/pagination-query.dto.js';

export class QueryLandDto extends PaginationQueryDto {
    @ApiPropertyOptional({example: 'Patuakhali' })
    @IsString()
    @IsOptional()
    location?: string;

    @ApiPropertyOptional({example: 'Loamy' })
    @IsString()
    @IsOptional()
    soil_type?: string;

    @ApiPropertyOptional({ enum: LAND_AVAILABILITY })
    @IsString()
    @IsOptional()
    @IsIn(LAND_AVAILABILITY)
    availability_status?: (typeof LAND_AVAILABILITY)[number];
}