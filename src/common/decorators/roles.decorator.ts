import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

export const APP_ROLES = {
  ADMIN: 'Admin',
  FARMER: 'Farmer',
  INVESTOR: 'Investor',
  LANDOWNER: 'Landowner',
} as const;


export type AppRole = 'Admin' | 'Farmer' | 'Investor' | 'Landowner';

export function Roles(...roles: AppRole[]) {
  return SetMetadata(ROLES_KEY, roles);
}

export function FarmerOnly() {
  return Roles(APP_ROLES.FARMER);
}

export function LandownerOnly() {          // @Roles('Landowner')   
  return Roles(APP_ROLES.LANDOWNER);
}

export function InvestorOnly() {
  return Roles(APP_ROLES.INVESTOR);
}