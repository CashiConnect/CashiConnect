import { Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

export class CreateHarvestDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  project_id: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Max(9999999999.99)
  quantity: number;

  @IsString()
  @Length(1, 30)
  unit: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(9999999999.99)
  sold_quantity: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(9999999999.99)
  selling_price_per_unit: number;

  @IsDateString({ strict: true })
  harvest_date: string;

  @IsOptional()
  @IsString()
  description?: string;
}
