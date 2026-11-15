import { IsInt, IsOptional, IsString, MaxLength, Min, MinLength, minLength,} from "class-validator";
import { IsNull } from "typeorm";

export class CreateFarmerProfileDto {
    @IsInt()
    @Min(0)
    experience_years: number;
    @IsString()
    @MaxLength(100)
    specialization: string;
    @IsString()
    @MaxLength(300)
    @IsOptional()
    bio?: string;
    @IsString()
    @MaxLength(300)
    @MinLength(3)
    address: string;
}