import { z } from 'zod';

export const roleSchema = z.enum(['admin', 'user', 'guest']);

export type Role = z.infer<typeof roleSchema>;
