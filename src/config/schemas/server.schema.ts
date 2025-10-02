import { z } from 'zod';

export const serverSchema = z.object({
  nodeEnv: z
    .string()
    .nonempty()
    .transform((x) => x.toLowerCase())
    .refine((x) => ['development', 'production', 'test'].includes(x), {
      message:
        'NODE_ENV must be one of "development", "production", or "test"',
    })
    .default('development'),
  port: z.number().int().positive().default(3000),
});

export type ServerConfig = z.infer<typeof serverSchema>;
