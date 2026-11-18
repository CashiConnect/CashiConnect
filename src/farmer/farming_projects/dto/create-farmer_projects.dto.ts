import { Type } from 'class-transformer';
import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

export class CreateFarmingProjectDto {
  @IsOptional()
  @IsString()
  @Length(1, 150)
  title?: string;

  @IsString()
  @Length(1, 100)
  crop_name: string;

  @IsString()
  @Length(1, 100)
  description: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Max(9999999999.99)
  required_funding: number;

  @IsDateString({ strict: true })
  start_date: string;

  @IsDateString({ strict: true })
  end_date: string;
}
