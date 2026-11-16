import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';

import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter.js';
import { fileURLToPath } from 'node:url';

import { User } from '../users/entities/user.entity.js';
import { Role } from '../roles/entities/roles.entity.js';
import { JwtStrategy } from './strategies/jwt.strategy.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';


@Module({
  imports: [
    
    TypeOrmModule.forFeature([User, Role]),

    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('MAIL_HOST', 'sandbox.smtp.mailtrap.io'),
          port: Number(configService.get<string>('MAIL_PORT', '2525')),
          secure: configService.get<string>('MAIL_SECURE', 'false') === 'true',
          auth: {
            user: configService.get<string>('MAIL_USER', ''),
            pass: configService.get<string>('MAIL_PASSWORD', ''),
          },
        },
        defaults: {
          from: configService.get<string>(
            'MAIL_FROM',
            'CashiConnect <no-reply@cashiconnect.local>',
          ),
        },
        template: {
          dir: fileURLToPath(new URL('./templates/', import.meta.url)),
          adapter: new HandlebarsAdapter(),
          options: { strict: true },
        },
      }),
    }),

    PassportModule.register({
      defaultStrategy: 'jwt',
    }),

    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: '15m',
        },
      }),
    }),
  ],

  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtAuthGuard],
  exports: [JwtAuthGuard],

})
export class AuthModule {}
