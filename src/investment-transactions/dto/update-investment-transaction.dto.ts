import { IsIn } from 'class-validator';
// Status may be set only by Admin, never by the paying Investor.
export class UpdateInvestmentTransactionDto {
  @IsIn(['pending', 'success', 'failed', 'refunded']) paymentStatus: string;
}
