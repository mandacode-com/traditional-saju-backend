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
  birthDateTime: z.string().datetime(),
  datingStatus: datingStatusSchema,
  jobStatus: jobStatusSchema,
});
export type YearlySajuRequest = z.infer<typeof YearlySajuRequestSchema>;

export const YearlySajuResponseSchema = z.object({
  name: z.string(),
  birthDateTime: z.string(),
  gender: genderSchema,
  chart: z.object({
    heavenly: z.object({
      stem: z.array(HeavenlyStemSchema),
      fiveElements: z.array(FiveElementSchema),
    }),
    earthly: z.object({
      branch: z.array(EarthlyBranchSchema),
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
    waysToAvoidBadLuck: z.string(),
  }),
});
export type YearlySajuResponse = z.infer<typeof YearlySajuResponseSchema>;
