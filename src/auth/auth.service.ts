import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../users/entities/user.entity.js';
import { Role } from '../roles/entities/roles.entity.js';

import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';

import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Role)
    private roleRepository: Repository<Role>,

    private jwtService: JwtService,
  ) {}

  // REGISTER
  async register(dto: RegisterDto) {
    const existingUser = await this.userRepository.findOne({
      where: [
        { email: dto.email },
        { phone: dto.phone },
      ],
    });

    if (existingUser) {
      throw new ConflictException(
        'Email or phone already exists',
      );
    }

    const role = await this.roleRepository.findOne({
      where: { name: dto.role },
    });

    if (!role || role.name === 'Admin') {
      throw new BadRequestException('Invalid role');
    }

    const hashedPassword = await bcrypt.hash(
      dto.password,
      10,
    );

    const user = this.userRepository.create({
      full_name: dto.full_name,
      email: dto.email,
      password: hashedPassword,
      phone: dto.phone,
      role: role,
      status: 'active',
    });

    const savedUser = await this.userRepository.save(user);

    return {
      message: 'Registration successful',

      user: {
        id: savedUser.id,
        full_name: savedUser.full_name,
        email: savedUser.email,
        role: role.name,
      },
    };
  }

  // LOGIN
  async login(dto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
      relations: {
        role: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException(
        'Invalid email or password',
      );
    }

    const isPasswordMatched = await bcrypt.compare(
      dto.password,
      user.password,
    );

    if (!isPasswordMatched) {
      throw new UnauthorizedException(
        'Invalid email or password',
      );
    }

    if (user.status !== 'active') {
      throw new UnauthorizedException(
        'Your account is not active',
      );
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role.name,
    };

    const accessToken = await this.jwtService.signAsync(
      payload,
    );

    return {
      message: 'Login successful',

      access_token: accessToken,

      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role.name,
      },
    };
  }
}