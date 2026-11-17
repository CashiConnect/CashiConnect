
import { IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateReportStatusDto {
  @IsIn(['reviewing', 'solved', 'rejected'])
  status: string;

  @IsOptional()
  @IsString()
  admin_note?: string;
}