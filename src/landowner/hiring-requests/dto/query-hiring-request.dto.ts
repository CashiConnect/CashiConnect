import { IsIn, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto.js';
import { HIRING_STATUS } from '../entities/hiring-request.entity.js';

export class QueryHiringRequestDto extends PaginationQueryDto {
    @ApiPropertyOptional({ enum: HIRING_STATUS })
    @IsOptional()
    @IsIn(HIRING_STATUS)
    status?: (typeof HIRING_STATUS)[number];
}