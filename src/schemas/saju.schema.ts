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
