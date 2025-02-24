import { z } from 'zod';
import { roleSchema } from './role.schema';

export const tokenPayloadSchema = z.object({
  uuid: z.string().nonempty().uuid(),
  role: roleSchema,
});

export type TokenPayload = z.infer<typeof tokenPayloadSchema>;
