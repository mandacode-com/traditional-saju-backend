import { z } from 'zod';
import {
  datingStatusSchema,
  genderSchema,
  jobStatusSchema,
} from './saju.schema';

export const DailySajuRequestSchema = z.object({
  gender: genderSchema,
  birthDateTime: z.date(),
  datingStatus: datingStatusSchema,
  jobStatus: jobStatusSchema,
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
  birthDateTime: z.date(),
  gender: genderSchema,
  ...DailySajuOpenAIResponseSchema.shape,
});
export type DailySajuResponse = z.infer<typeof DailySajuResponseSchema>;
