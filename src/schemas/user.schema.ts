import { DatingStatus, Gender, JobStatus } from '@prisma/client';
import { z } from 'zod';

export const updateUserSchema = z.object({
  name: z.string().optional(),
  gender: z.nativeEnum(Gender).optional(),
  birthDateTime: z.string().datetime().optional(),
  age: z.number().optional(),
  dating: z.nativeEnum(DatingStatus).optional(),
  job: z.nativeEnum(JobStatus).optional(),
});

export type UpdateUser = z.infer<typeof updateUserSchema>;
