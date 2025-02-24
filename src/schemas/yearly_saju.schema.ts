import { z } from 'zod';
import {
  datingStatusSchema,
  EarthlyBranchSchema,
  FiveElementSchema,
  genderSchema,
  HeavenlyStemSchema,
  jobStatusSchema,
} from './saju.schema';

export const YearlySajuRequestSchema = z.object({
  gender: genderSchema,
  birthDateTime: z.date(),
  datingStatus: datingStatusSchema,
  jobStatus: jobStatusSchema,
});
export type YearlySajuRequest = z.infer<typeof YearlySajuRequestSchema>;

export const YearlySajuOpenAIResponseSchema = z.object({
  chart: z.object({
    heavenly: z.object({
      stems: z.array(HeavenlyStemSchema),
      fiveElements: z.array(FiveElementSchema),
    }),
    earthly: z.object({
      branches: z.array(EarthlyBranchSchema),
      fiveElements: z.array(FiveElementSchema),
    }),
  }),
  description: z.object({
    general: z.string(),
    relationship: z.string(),
    wealth: z.string(),
    romantic: z.string(),
    health: z.string(),
    career: z.string(),
    waysToImprove: z.string(),
    caution: z.string(),
    questionAnswer: z.string().optional(),
  }),
});
export type YearlySajuOpenAIResponse = z.infer<
  typeof YearlySajuOpenAIResponseSchema
>;

export const YearlySajuResponseSchema = z.object({
  name: z.string(),
  birthDateTime: z.date(),
  gender: genderSchema,
  ...YearlySajuOpenAIResponseSchema.shape,
});
export type YearlySajuResponse = z.infer<typeof YearlySajuResponseSchema>;
