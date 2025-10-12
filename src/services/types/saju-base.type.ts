import { z } from 'zod';
import { Gender, DatingStatus, JobStatus } from '../../types/user.type';
import { EarthlyBranch, FiveElement, HeavenlyStem } from 'src/types/chart.type';

export const EarthlyBranchSchema = z.nativeEnum(EarthlyBranch);
export const HeavenlyStemSchema = z.nativeEnum(HeavenlyStem);
export const FiveElementSchema = z.nativeEnum(FiveElement);

// Zod schemas for validation
export const GenderSchema = z.nativeEnum(Gender);
export const DatingStatusSchema = z.nativeEnum(DatingStatus);
export const JobStatusSchema = z.nativeEnum(JobStatus);
