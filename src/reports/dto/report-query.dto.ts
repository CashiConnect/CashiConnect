import { IsIn, IsOptional } from 'class-validator';

export class ReportQueryDto {
  @IsOptional()
  @IsIn(['pending', 'reviewing', 'solved', 'rejected'])
  status?: string;
}