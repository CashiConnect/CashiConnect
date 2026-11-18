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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateHarvestDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiProperty({ example: 1, description: 'ID of a project owned by the authenticated farmer' })
  project_id: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Max(9999999999.99)
  @ApiProperty({ example: 100 })
  quantity: number;

  @IsString()
  @Length(1, 30)
  @ApiProperty({ example: 'kg' })
  unit: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(9999999999.99)
  @ApiProperty({ example: 40 })
  sold_quantity: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(9999999999.99)
  @ApiProperty({ example: 75 })
  selling_price_per_unit: number;

  @IsDateString({ strict: true })
  @ApiProperty({ example: '2026-11-18', format: 'date' })
  harvest_date: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'First tomato harvest of the season.' })
  description?: string;
}
