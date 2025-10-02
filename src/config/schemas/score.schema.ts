import { z } from 'zod';

export const scoreSchema = z.object({
  mean: z.number().min(0).max(100).default(70),
  stdDev: z.number().min(1).max(50).default(10),
});

export type ScoreConfig = z.infer<typeof scoreSchema>;
