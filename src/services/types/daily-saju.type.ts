import { z } from 'zod';
import {
  DatingStatusSchema,
  GenderSchema,
  JobStatusSchema,
} from './saju-base.type';

export const DailySajuRequestSchema = z.object({
  userId: z.string().uuid(),
  userName: z.string().min(1).max(20),
  gender: GenderSchema,
  birthDateTime: z.string().datetime(),
  datingStatus: DatingStatusSchema,
  jobStatus: JobStatusSchema,
  question: z.string().optional(),
});
export type DailySajuRequest = z.infer<typeof DailySajuRequestSchema>;

export const DailySajuOpenAIResponseSchema = z.object({
  todayShortMessage: z.string(),
  totalFortuneMessage: z.string(),
  relationship: z.string(),
  wealth: z.string(),
  romantic: z.string(),
  health: z.string(),
  caution: z.string(),
  questionAnswer: z.string().optional(),
});

export type DailySajuOpenAIResponse = z.infer<
  typeof DailySajuOpenAIResponseSchema
>;

export const DailySajuResultSchema = z.object({
  name: z.string(),
  birthDateTime: z.string().datetime(),
  gender: GenderSchema,
  fortuneScore: z.number(),
  ...DailySajuOpenAIResponseSchema.shape,
});
export type DailySajuResult = z.infer<typeof DailySajuResultSchema>;
