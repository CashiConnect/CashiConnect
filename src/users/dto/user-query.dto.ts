import { IsIn, IsOptional } from 'class-validator';
import { APP_ROLES } from '../../common/decorators/roles.decorator.js';

export class UserQueryDto {
  @IsOptional()
  @IsIn(Object.values(APP_ROLES))
  role?: string;

  @IsOptional()
  @IsIn(['active', 'inactive', 'suspended'])
  status?: string;
}