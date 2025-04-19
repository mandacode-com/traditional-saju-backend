import { z } from 'zod';
import {
  DatingStatusSchema,
  GenderSchema,
  JobStatusSchema,
} from './saju/saju_base.schema';

export const updateUserSchema = z.object({
  name: z.string().optional(),
  gender: GenderSchema.optional(),
  birthDateTime: z.string().datetime().optional(),
  age: z.number().optional(),
  dating: DatingStatusSchema.optional(),
  job: JobStatusSchema.optional(),
});

export type UpdateUser = z.infer<typeof updateUserSchema>;
