import { IsIn, IsOptional } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto.js';
import { APP_ROLES } from '../../common/decorators/roles.decorator.js';


export class UserQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsIn(Object.values(APP_ROLES))
  role?: string;

  @IsOptional()
  @IsIn(['active', 'inactive', 'suspended'])
  status?: string;
}