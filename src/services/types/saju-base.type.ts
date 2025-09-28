import { z } from 'zod';

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

export enum DatingStatus {
  SINGLE = 'single',
  DATING = 'dating',
  MARRIED = 'married',
}

export const DatingStatusSchema = z.nativeEnum(DatingStatus);

export enum JobStatus {
  STUDENT = 'student',
  WORKING = 'working',
  UNEMPLOYED = 'unemployed',
}

export const JobStatusSchema = z.nativeEnum(JobStatus);

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

export const GenderSchema = z.nativeEnum(Gender);
