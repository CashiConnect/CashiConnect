import { Type } from 'class-transformer';
import { IsIn, IsInt, IsNumber, IsPositive, Max, Min } from 'class-validator';
export class CreateInvestmentReturnDto {
  @Type(() => Number) @IsInt() @Min(1) investmentId: number;
  @Type(() => Number) @IsNumber({ maxDecimalPlaces: 2 }) @IsPositive() @Max(9999999999.99) returnAmount: number;
  @IsIn(['profit', 'principal']) returnType: string;
}
