import { z } from 'zod';

export const idpSchema = z.object({
  authUrl: z.string().url().nonempty(),
  userUrl: z.string().url().nonempty(),
  clientId: z.string().nonempty(),
  clientSecret: z.string().nonempty(),
});

export type IdpConfig = z.infer<typeof idpSchema>;
