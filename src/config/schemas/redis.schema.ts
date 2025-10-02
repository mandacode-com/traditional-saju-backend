import { z } from 'zod';

export const redisSchema = z
  .object({
    // Standalone mode
    mode: z.literal('standalone').default('standalone'),
    host: z.string().nonempty().default('localhost'),
    port: z.number().int().positive().default(6379),
    password: z.string().optional(),
    db: z.number().int().nonnegative().default(0),
  })
  .or(
    z.object({
      // Sentinel mode
      mode: z.literal('sentinel'),
      sentinels: z
        .array(
          z.object({
            host: z.string().nonempty(),
            port: z.number().int().positive(),
          }),
        )
        .nonempty(),
      name: z.string().nonempty(), // Sentinel master name
      password: z.string().optional(),
      sentinelPassword: z.string().optional(),
      db: z.number().int().nonnegative().default(0),
    }),
  );

export type RedisConfig = z.infer<typeof redisSchema>;
