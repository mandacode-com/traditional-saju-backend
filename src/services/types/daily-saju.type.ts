import { z } from 'zod';
import { GenderSchema } from './saju-base.type';
import { Gender, DatingStatus, JobStatus } from '../../types/user.type';

export interface DailySajuInput {
  userId: string;
  userName: string;
  gender: Gender;
  birthDateTime: string;
  datingStatus: DatingStatus;
  jobStatus: JobStatus;
  question?: string;
}

export const DailySajuOpenAIResponseSchema = z.object({
  todayShortMessage: z.string(),
  totalFortuneMessage: z.string(),
  relationship: z.string(),
  wealth: z.string(),
  romantic: z.string(),
  health: z.string(),
  caution: z.string(),
  questionAnswer: z.string().nullable(),
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
