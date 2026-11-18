import { IsEmail, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @IsEmail()
  @ApiProperty({ example: 'farmer@gmail.com' })
  email: string;

  @MinLength(6)
  @ApiProperty({ example: '12345678' })
  password: string;
}
