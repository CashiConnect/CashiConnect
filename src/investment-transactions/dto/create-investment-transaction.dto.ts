import { Type } from 'class-transformer';
import { IsIn, IsInt, IsNotEmpty, IsNumber, IsPositive, IsString, Max, MaxLength, Min } from 'class-validator';
export class CreateInvestmentTransactionDto {
  @Type(() => Number) @IsInt() @Min(1) investmentId: number;
  @IsString() @IsNotEmpty() @MaxLength(100) transactionReference: string;
  @Type(() => Number) @IsNumber({ maxDecimalPlaces: 2 }) @IsPositive() @Max(9999999999.99) amount: number;
  @IsIn(['bKash', 'Nagad', 'Bank', 'Cash']) paymentMethod: string;
}
