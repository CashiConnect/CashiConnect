import { IsOptional, IsString, MaxLength, IsNotEmpty } from 'class-validator';
export class CreateInvestorProfileDto {
  @IsString() 
  @IsNotEmpty() 
  address: string;
  @IsOptional() 
  @IsString() 
  @MaxLength(100) 
  occupation?: string;
  @IsOptional() 
  @IsString() 
  @MaxLength(150) 
  investmentInterest?: string;
  @IsOptional() @IsString() 
  bio?: string;
}
