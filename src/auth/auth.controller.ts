
import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiConflictResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse,
} from '@nestjs/swagger';



import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';


@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Create a new account (Farmer, Investor or Landowner)' })
  @ApiConflictResponse({ description: 'Email or phone already exists' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Log in and receive a JWT access token' })
  @ApiUnauthorizedResponse({ description: 'Invalid email or password, or account not active' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get the logged-in user\'s account details' })
  @ApiUnauthorizedResponse({ description: 'Missing, invalid or expired token' })
  getMe(@CurrentUser('userId') userId: number) {
    return this.authService.getMe(userId);
  }
}