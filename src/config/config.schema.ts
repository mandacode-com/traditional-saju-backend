import { z } from 'zod';
import {
  serverSchema,
  tokenSchema,
  redisSchema,
  idpSchema,
  scoreSchema,
  openaiSchema,
} from './schemas';

export const configSchema = z.object({
  server: serverSchema,
  token: tokenSchema,
  redis: redisSchema,
  idp: idpSchema,
  score: scoreSchema,
  openai: openaiSchema,
});

export type Config = z.infer<typeof configSchema>;
