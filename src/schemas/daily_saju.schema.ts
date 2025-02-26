import { DatingStatus, Gender, JobStatus } from '@prisma/client';
import { z } from 'zod';

export const DailySajuRequestSchema = z.object({
  gender: z.nativeEnum(Gender),
  birthDateTime: z.date(),
  datingStatus: z.nativeEnum(DatingStatus),
  jobStatus: z.nativeEnum(JobStatus),
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
  birthDateTime: z.date(),
  gender: z.nativeEnum(Gender),
  ...DailySajuOpenAIResponseSchema.shape,
});
export type DailySajuResponse = z.infer<typeof DailySajuResponseSchema>;
