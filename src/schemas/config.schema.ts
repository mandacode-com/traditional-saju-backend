import { z } from 'zod';

export const configSchema = z.object({
  server: z.object({
    nodeEnv: z
      .string()
      .nonempty()
      .transform((x) => x.toLowerCase())
      .refine((x) => ['development', 'production', 'test'].includes(x), {
        message:
          'NODE_ENV must be one of "development", "production", or "test"',
      })
      .default('development'),
    port: z.number().int().positive().default(3000),
  }),
  eventBus: z.object({
    client: z.object({
      clientId: z.string().nonempty().default('saju.saju-core'),
      brokers: z.array(z.string().nonempty()),
    }),
    consumer: z.object({
      groupId: z.string().nonempty().default('saju.saju-core'),
    }),
    dlt: z.object({
      retry: z.object({
        maxAttempts: z.number().int().nonnegative().default(3),
        delay: z.number().int().nonnegative().default(1000),
      }),
    }),
  }),

  openai: z.object({
    api_key: z.string().nonempty(),
    system_message: z.object({
      daily: z.object({
        all: z
          .string()
          .nonempty()
          .default(
            '주어지는 정보에 대해 일일 사주를 서술해줘. 답변은 한국어이어야 하며 각각 300자 이내로 해줘.',
          ),
      }),
      yearly: z.object({
        chart: z
          .string()
          .nonempty()
          .default(
            '주어지는 정보에 대해 신년 사주를 서술해줘. 만약 시간 비활성화가 있다면 시간은 생략해.',
          ),
        general: z
          .string()
          .nonempty()
          .default(
            '주어진 사주 정보에 대해 신년운세 총운을 한국어로 서술해줘. 800자 이내여야 하며 사용자 정보를 답변에 사용하지 않아도 돼.',
          ),
        relationship: z
          .string()
          .nonempty()
          .default(
            '주어진 사주 정보에 대해 대인관계운을 한국어로 서술해줘. 500자 이내여야 하며 사용자 정보를 답변에 사용하지 않아도 돼.',
          ),
        wealth: z
          .string()
          .nonempty()
          .default(
            '주어진 사주 정보에 대해 재물운을 한국어로 서술해줘. 500자 이내여야 하며 사용자 정보를 답변에 사용하지 않아도 돼.',
          ),
        romantic: z
          .string()
          .nonempty()
          .default(
            '주어진 사주 정보에 대해 연애운을 한국어로 서술해줘. 500자 이내여야 하며 사용자 정보를 답변에 사용하지 않아도 돼.',
          ),
        health: z
          .string()
          .nonempty()
          .default(
            '주어진 사주 정보에 대해 건강운을 한국어로 서술해줘. 500자 이내여야 하며 사용자 정보를 답변에 사용하지 않아도 돼.',
          ),
        career: z
          .string()
          .nonempty()
          .default(
            '주어진 사주 정보에 대해 직업운을 한국어로 서술해줘. 500자 이내여야 하며 사용자 정보를 답변에 사용하지 않아도 돼.',
          ),
        waysToImprove: z
          .string()
          .nonempty()
          .default(
            '주어진 사주 정보에 대해 올해 운을 높이는 법을 한국어로 서술해줘. 열거형이 아닌 서술형 이어야하며 500자 이내여야 하고 사용자 정보를 답변에 사용하지 않아도 돼.',
          ),
        caution: z
          .string()
          .nonempty()
          .default(
            '주어진 사주 정보에 대해 주의할 점을 한국어로 서술해줘. 500자 이내여야 하며 사용자 정보를 답변에 사용하지 않아도 돼.',
          ),
        questionAnswer: z
          .string()
          .nonempty()
          .default(
            '주어진 사주 정보에 대해 질문에 대한 답변을 한국어로 서술해줘. 500자 이내여야 하며 사용자 정보를 답변에 사용하지 않아도 돼.' +
              '만약 질문이 주어지지 않았다면 답변은 생략해도 돼.',
          ),
      }),
    }),
  }),
  auth: z.object({
    gatewayJwtSecret: z.string().nonempty(),
    gatewayJwtHeader: z.string().nonempty().default('x-gateway-jwt'),
  }),
});

export type Config = z.infer<typeof configSchema>;
