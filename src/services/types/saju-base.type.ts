import { z } from 'zod';
import { Gender, DatingStatus, JobStatus } from '../../types/user.type';

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

// Zod schemas for validation
export const GenderSchema = z.nativeEnum(Gender);
export const DatingStatusSchema = z.nativeEnum(DatingStatus);
export const JobStatusSchema = z.nativeEnum(JobStatus);
