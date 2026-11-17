
import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateReportDto {
  @IsOptional()
  @IsInt()
  reportedUserID?: number;

  @IsOptional()
  @IsInt()
  project_id?: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  subject: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}