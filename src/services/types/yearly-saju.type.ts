import { z } from 'zod';
import {
  EarthlyBranchSchema,
  FiveElementSchema,
  GenderSchema,
  HeavenlyStemSchema,
} from './saju-base.type';
import { Gender, DatingStatus, JobStatus } from '../../types/user.type';

export interface YearlySajuInput {
  userId: string;
  userName: string;
  gender: Gender;
  birthDateTime: string;
  birthTimeDisabled: boolean;
  datingStatus: DatingStatus;
  jobStatus: JobStatus;
  question?: string;
}

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

export const YearlySajuResultSchema = z.object({
  name: z.string(),
  birthDateTime: z.string().datetime(),
  gender: GenderSchema,
  ...YearlySajuOpenAIResponseSchema.shape,
});
export type YearlySajuResult = z.infer<typeof YearlySajuResultSchema>;
