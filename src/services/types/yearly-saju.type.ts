import { z } from 'zod';
import {
  DatingStatusSchema,
  EarthlyBranchSchema,
  FiveElementSchema,
  GenderSchema,
  HeavenlyStemSchema,
  JobStatusSchema,
} from './saju-base.type';

export const YearlySajuRequestSchema = z.object({
  userId: z.string().optional(),
  userName: z.string(),
  gender: GenderSchema,
  birthDateTime: z.string().datetime(),
  birthTimeDisabled: z.boolean(),
  datingStatus: DatingStatusSchema,
  jobStatus: JobStatusSchema,
  question: z.string().optional(),
});
export type YearlySajuRequest = z.infer<typeof YearlySajuRequestSchema>;

export const YearlySajuOpenAIResponseSchema = z.object({
  chart: z.object({
    heavenly: z.object({
      stems: z.object({
        year: HeavenlyStemSchema,
        month: HeavenlyStemSchema,
        day: HeavenlyStemSchema,
        hour: HeavenlyStemSchema.nullable(),
      }),
      fiveElements: z.object({
        year: FiveElementSchema,
        month: FiveElementSchema,
        day: FiveElementSchema,
        hour: FiveElementSchema.nullable(),
      }),
    }),
    earthly: z.object({
      branches: z.object({
        year: EarthlyBranchSchema,
        month: EarthlyBranchSchema,
        day: EarthlyBranchSchema,
        hour: EarthlyBranchSchema.nullable(),
      }),
      fiveElements: z.object({
        year: FiveElementSchema,
        month: FiveElementSchema,
        day: FiveElementSchema,
        hour: FiveElementSchema.nullable(),
      }),
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
    questionAnswer: z.string().nullable(),
  }),
});
export type YearlySajuOpenAIResponse = z.infer<
  typeof YearlySajuOpenAIResponseSchema
>;

export const YearlySajuResponseSchema = z.object({
  name: z.string(),
  birthDateTime: z.string().datetime(),
  gender: GenderSchema,
  ...YearlySajuOpenAIResponseSchema.shape,
});
export type YearlySajuResponse = z.infer<typeof YearlySajuResponseSchema>;
