import { z } from 'zod';

export const tokenSchema = z.object({
  accessTokenSecret: z.string().nonempty(),
  refreshTokenSecret: z.string().nonempty(),
  accessTokenExpiresIn: z.number().int().positive().default(900), // 15 minutes
  refreshTokenExpiresIn: z.number().int().positive().default(604800), // 7 days
});

export type TokenConfig = z.infer<typeof tokenSchema>;
