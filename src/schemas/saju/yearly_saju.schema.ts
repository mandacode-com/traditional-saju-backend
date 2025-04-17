import { z } from 'zod';
import {
  DatingStatusSchema,
  EarthlyBranchSchema,
  FiveElementSchema,
  GenderSchema,
  HeavenlyStemSchema,
  JobStatusSchema,
} from './saju_base.schema';

export const YearlySajuRequestSchema = z.object({
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
        hour: z.optional(HeavenlyStemSchema),
      }),
      fiveElements: z.object({
        year: FiveElementSchema,
        month: FiveElementSchema,
        day: FiveElementSchema,
        hour: z.optional(FiveElementSchema),
      }),
    }),
    earthly: z.object({
      branches: z.object({
        year: EarthlyBranchSchema,
        month: EarthlyBranchSchema,
        day: EarthlyBranchSchema,
        hour: z.optional(EarthlyBranchSchema),
      }),
      fiveElements: z.object({
        year: FiveElementSchema,
        month: FiveElementSchema,
        day: FiveElementSchema,
        hour: z.optional(FiveElementSchema),
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
    questionAnswer: z.string().optional(),
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
