import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsPositive, Max, Min } from 'class-validator';
export class CreateInvestmentDto {
  @Type(() => Number) @IsInt() @Min(1) projectId: number;
  @Type(() => Number) @IsNumber({ maxDecimalPlaces: 2 }) @IsPositive() @Max(9999999999.99) amount: number;
}
