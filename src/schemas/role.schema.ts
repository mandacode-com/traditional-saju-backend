import { z } from 'zod';

export enum RoleEnum {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest',
}

export const roleSchema = z.nativeEnum(RoleEnum);

export type Role = z.infer<typeof roleSchema>;
