import { z } from 'zod';
import {
  DatingStatusSchema,
  GenderSchema,
  JobStatusSchema,
} from './saju-base.type';

export const DailySajuRequestSchema = z.object({
  gender: GenderSchema,
  birthDateTime: z.string().datetime(),
  datingStatus: DatingStatusSchema,
  jobStatus: JobStatusSchema,
  question: z.string().optional(),
});
export type DailySajuRequest = z.infer<typeof DailySajuRequestSchema>;

export const DailySajuOpenAIResponseSchema = z.object({
  todayShortMessage: z.string(),
  fortuneScore: z.number(),
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

export const DailySajuResponseSchema = z.object({
  name: z.string(),
  birthDateTime: z.string().datetime(),
  gender: GenderSchema,
  ...DailySajuOpenAIResponseSchema.shape,
});
export type DailySajuResponse = z.infer<typeof DailySajuResponseSchema>;
