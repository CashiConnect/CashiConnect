import { IsIn } from 'class-validator';
// Admin-only status update. Investor cannot edit projectId, amount or investorId.
export class UpdateInvestmentDto {
  @IsIn(['pending', 'confirmed', 'cancelled', 'completed']) status: string;
}
