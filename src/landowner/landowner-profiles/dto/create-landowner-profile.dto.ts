import {Type} from 'class-transformer';
import {IsBoolean,
    IsInt,
    IsNotEmpty,
     IsNumber,
     IsOptional,
     IsPositive,
      IsString, 
      Min,
    Max,
    MaxLength} from 'class-validator';
import {ApiProperty,
        ApiPropertyOptional} from '@nestjs/swagger';

    export class CreateLandownerProfileDto {
        @ApiProperty({ example:'Patuakhali,Barishal' })
        @IsString()
        @IsNotEmpty()
        @MaxLength(100)
        address: string;

        @ApiProperty({ example:'Businessman' })  
        @IsOptional()
        @IsString()
        @MaxLength(150)
        occupation: string;

        @ApiPropertyOptional({example:'I own firm land in Patuakhali,Barishal'})
        @IsOptional()
        @IsString()
        @MaxLength(500)
        bio: string;

    }