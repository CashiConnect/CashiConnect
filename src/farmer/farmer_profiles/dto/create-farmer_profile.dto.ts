import { IsInt, IsOptional, IsString, MaxLength, Min, MinLength, minLength,} from "class-validator";
import { IsNull } from "typeorm";
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFarmerProfileDto {
    @IsInt()
    @Min(0)
    @ApiProperty({ example: 5, description: 'Years of farming experience' })
    experience_years: number;
    @IsString()
    @MaxLength(100)
    @ApiProperty({ example: 'Rice and vegetable farming' })
    specialization: string;
    @IsString()
    @MaxLength(300)
    @IsOptional()
    @ApiPropertyOptional({ example: 'Experienced farmer focused on sustainable agriculture.' })
    bio?: string;
    @IsString()
    @MaxLength(300)
    @MinLength(3)
    @ApiProperty({ example: 'Village Road, Rangpur, Bangladesh' })
    address: string;
}
