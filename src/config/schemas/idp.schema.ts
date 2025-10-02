import { z } from 'zod';

export const idpSchema = z.object({
  baseUrl: z.string().url().nonempty(),
  clientId: z.string().nonempty(),
  clientSecret: z.string().nonempty(),
});

export type IdpConfig = z.infer<typeof idpSchema>;
