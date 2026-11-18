import { Injectable, ConflictException, UnauthorizedException, BadRequestException, Logger,
 NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity.js';
import { Role } from '../roles/entities/roles.entity.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Role)
    private roleRepository: Repository<Role>,

    private jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}




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

    try {
      await this.mailerService.sendMail({
        to: savedUser.email,
        subject: 'Welcome to CashiConnect',
        template: 'welcome',
        context: {
          fullName: savedUser.full_name,
          role: role.name,
        },
      });
    } catch (error) {
      this.logger.error(
        `Welcome email could not be sent to ${savedUser.email}`,
        error instanceof Error ? error.stack : String(error),
      );
    }

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




  async login(dto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
      relations: { role: true },
    });

    if (!user) {
      throw new UnauthorizedException(
        'Invalid email or password',
      );
    }

    const isPasswordMatched = await bcrypt.compare( dto.password, user.password );

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

    const accessToken = await this.jwtService.signAsync( payload );

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


  

   async getMe(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: { role: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      phone: user.phone,
      status: user.status,
      role: user.role.name,
      created_at: user.created_at,
    };
  }

}
