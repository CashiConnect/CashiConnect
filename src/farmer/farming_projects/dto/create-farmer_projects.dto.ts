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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFarmingProjectDto {
  @IsOptional()
  @IsString()
  @Length(1, 150)
  @ApiPropertyOptional({ example: 'Rangpur Tomato Farming Project' })
  title?: string;

  @IsString()
  @Length(1, 100)
  @ApiProperty({ example: 'Tomato' })
  crop_name: string;

  @IsString()
  @Length(1, 100)
  @ApiProperty({ example: 'Grow tomatoes on the selected land using sustainable methods.' })
  description: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Max(9999999999.99)
  @ApiProperty({ example: 250000, minimum: 0.01, maximum: 9999999999.99 })
  required_funding: number;

  @IsDateString({ strict: true })
  @ApiProperty({ example: '2026-12-01', format: 'date' })
  start_date: string;

  @IsDateString({ strict: true })
  @ApiProperty({ example: '2027-04-30', format: 'date' })
  end_date: string;
}
