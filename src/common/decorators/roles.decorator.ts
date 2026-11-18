import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

export const APP_ROLES = {
  ADMIN: 'Admin',
  FARMER: 'Farmer',
  INVESTOR: 'Investor',
  LANDOWNER: 'Landowner',
} as const;

export type AppRole = (typeof APP_ROLES)[keyof typeof APP_ROLES];

export const Roles = (...roles: AppRole[]) => SetMetadata(ROLES_KEY, roles);

export const FarmerOnly = () => Roles(APP_ROLES.FARMER);

export const LandownerOnly = () => Roles(APP_ROLES.LANDOWNER);
