import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesModule } from './roles/roles.module.js';
import { UsersModule } from './users/users.module.js';

import { FarmerProfilesModule } from './farmer/farmer_profiles/farmer_profiles.module.js';
import { FarmingProjectsModule } from './farmer/farming_projects/farming_projects.module.js';
import { ProjectUpdatesModule } from './farmer/project_updates/project_updates.module.js';
import { HarvestsModule } from './farmer/harvests/harvests.module.js';

@Module({
  imports: [AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_DATABASE'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    RolesModule,
    UsersModule,

    
    FarmerProfilesModule,

    
    FarmingProjectsModule,

    
    ProjectUpdatesModule,

    
    HarvestsModule,



  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
