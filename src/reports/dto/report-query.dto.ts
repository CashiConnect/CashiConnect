
import { IsIn, IsOptional } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto.js';

export class ReportQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsIn(['pending', 'reviewing', 'solved', 'rejected'])
  status?: string;
}