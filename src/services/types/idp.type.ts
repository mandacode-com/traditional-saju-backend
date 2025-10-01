import z from 'zod';

export const UserIdentityResponseSchema = z
  .object({
    user_id: z.string(),
    nickname: z.string(),
    email: z.string().email(),
    provider: z.string(),
    created_at: z.string().transform((str) => new Date(str)),
    updated_at: z.string().transform((str) => new Date(str)),
    raw_data: z.record(z.any()).optional(),
  })
  .transform((obj) => ({
    userId: obj.user_id,
    nickname: obj.nickname,
    email: obj.email,
    provider: obj.provider,
    createdAt: obj.created_at,
    updatedAt: obj.updated_at,
    rawData: obj.raw_data,
  }));

export type UserIdentityResponseDto = z.infer<
  typeof UserIdentityResponseSchema
>;
