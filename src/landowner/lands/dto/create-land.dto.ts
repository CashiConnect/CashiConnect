import { Type } from 'class-transformer';
import {
    IsIn,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsPositive,
    IsString,
    MaxLength,
    Min,
} from 'class-validator';
import { ApiProperty,
         ApiPropertyOptional } from '@nestjs/swagger';

export const SIZE_UNITS = ['bigha', 'acre', 'decimal', 'katha'] as const;

export class CreateLandDto {

    @ApiProperty({ example: 'North Field' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(150)
    land_name: string;

    @ApiProperty({ example: 'Patuakhali,Barishal' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    location: string;

    @ApiProperty({ example: 2.5 })
    @Type(() => Number)
    @IsNumber({ maxDecimalPlaces: 2 })
    @IsPositive()
    land_size: number;

    @ApiProperty({ enum: SIZE_UNITS, example: 'bigha' })
    @IsIn(SIZE_UNITS)
    size_unit: string;

    @ApiProperty({ example: 'Loamy' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    soil_type: string;

    @ApiProperty({ example: 15000 })
    @Type(() => Number)
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    rental_price: number;

    @ApiPropertyOptional({ example: 'Irrigation facility available' })
    @IsOptional()
    @IsString()
    description?: string;
}