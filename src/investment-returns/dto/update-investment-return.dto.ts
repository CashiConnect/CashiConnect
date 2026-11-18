import { Type } from 'class-transformer';
import { IsIn, IsNumber, IsOptional, IsPositive, Max } from 'class-validator';
export class UpdateInvestmentReturnDto {
  @IsOptional() @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 }) @IsPositive() @Max(9999999999.99)
  returnAmount?: number;
  @IsOptional() @IsIn(['pending', 'paid', 'cancelled']) status?: string;
}
