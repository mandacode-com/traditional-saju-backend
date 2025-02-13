import { z } from 'zod';

export const genderSchema = z.enum(['male', 'female']);
export type Gender = z.infer<typeof genderSchema>;

export const datingStatusSchema = z.enum(['single', 'dating', 'married']);
export type DatingStatus = z.infer<typeof datingStatusSchema>;

export const jobStatusSchema = z.enum(['student', 'employed', 'unemployed']);
export type JobStatus = z.infer<typeof jobStatusSchema>;

export const EarthlyBranchSchema = z.enum([
  'ja',
  'chuk',
  'inn',
  'myo',
  'jin',
  'sa',
  'o',
  'mi',
  'sin',
  'yu',
  'sul',
  'hae',
]);
export type EarthlyBranch = z.infer<typeof EarthlyBranchSchema>;

export const HeavenlyStemSchema = z.enum([
  'gap',
  'eul',
  'byeong',
  'jeong',
  'mu',
  'gi',
  'gyeong',
  'sin',
  'im',
  'gye',
]);
export type HeavenlyStem = z.infer<typeof HeavenlyStemSchema>;

export const FiveElementSchema = z.enum(['mok', 'hwa', 'to', 'geum', 'su']);
export type FiveElement = z.infer<typeof FiveElementSchema>;
