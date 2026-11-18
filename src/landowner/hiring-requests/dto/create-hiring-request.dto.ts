import { Type } from 'class-transformer';
import {
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsPositive,
    IsString,
    MaxLength,} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateHiringRequestDto {
    @ApiProperty({ example: 1, description: 'farmer_profiles.id' })
    @Type(() => Number)
    @IsInt()
    @IsPositive()
    farmer_id: number;

    @ApiProperty({ example: 1, description: 'One of your own lands' })
    @Type(() => Number)
    @IsInt()
    @IsPositive()
    land_id: number;

    @ApiProperty({ example: 'Paddy cultivation for Boro season' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(150)
    job_title: string;

    @ApiProperty({ example: 'Prepare land, plant and take care of paddy.' })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({ example: 12000 })
    @Type(() => Number)
    @IsNumber({ maxDecimalPlaces: 2 })
    @IsPositive()
    proposed_salary: number;
}