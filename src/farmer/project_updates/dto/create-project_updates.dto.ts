import { Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsNumber,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectUpdateDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiProperty({ example: 1, description: 'ID of a project owned by the authenticated farmer' })
  project_id: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  @ApiProperty({ example: 25.5, minimum: 0, maximum: 100 })
  progress_percentage: number;

  @IsString()
  @Length(1, 150)
  @ApiProperty({ example: 'Land preparation completed' })
  milestone: string;

  @IsString()
  @Length(1, 10000)
  @ApiProperty({ example: 'The selected plot has been cleared and prepared for planting.' })
  description: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(9999999999.99)
  @ApiProperty({ example: 12000 })
  expense_amount: number;

  @IsDateString({ strict: true })
  @ApiProperty({ example: '2026-11-18T10:30:00.000Z', format: 'date-time' })
  update_date: string;
}
