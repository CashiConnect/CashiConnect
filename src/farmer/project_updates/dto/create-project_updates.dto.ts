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

export class CreateProjectUpdateDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  project_id: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  progress_percentage: number;

  @IsString()
  @Length(1, 150)
  milestone: string;

  @IsString()
  @Length(1, 10000)
  description: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(9999999999.99)
  expense_amount: number;

  @IsDateString({ strict: true })
  update_date: string;
}
