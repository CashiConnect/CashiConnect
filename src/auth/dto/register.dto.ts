import { IsEmail, IsIn, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class RegisterDto {
  @ApiProperty({ example: 'Md Akil' })
  @IsString()
  @IsNotEmpty()
  full_name: string;

  @ApiProperty({ example: 'akil@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ minLength: 6 })
  @MinLength(6)
  password: string;

  @ApiProperty({ example: '01511111111' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ enum: ['Farmer', 'Investor', 'Landowner'], example: 'Farmer' })
  @IsIn(['Farmer', 'Investor', 'Landowner'])
  role: string;
}