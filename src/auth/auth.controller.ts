import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';


@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login and receive a JWT access token' })
  @ApiResponse({
    status: 200,
    description: 'Copy access_token, then use Authorize to call protected endpoints.',
    schema: {
      example: {
        message: 'Login successful',
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.example.signature',
        user: {
          id: 1,
          full_name: 'Example Farmer',
          email: 'farmer@example.com',
          role: 'Farmer',
        },
      },
    },
  })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@CurrentUser('userId') userId: number) {
    return this.authService.getMe(userId);
  }
}
