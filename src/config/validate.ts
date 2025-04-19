import { Config, configSchema } from 'src/schemas/config.schema';

const parseIntIfExists = (value: string | undefined) => {
  if (value === undefined) {
    return undefined;
  }
  const parsedValue = parseInt(value);
  return isNaN(parsedValue) ? undefined : parsedValue;
};

export function validate(raw: Record<string, unknown>) {
  const env: Config = {
    server: {
      nodeEnv: raw.NODE_ENV as string,
      port: parseIntIfExists(raw.PORT as string) as number,
    },
    eventBus: {
      client: {
        clientId: raw.EVENT_BUS_CLIENT_ID as string,
        brokers: ((raw.EVENT_BUS_BROKERS as string | undefined) ?? '').split(
          ',',
        ),
      },
      consumer: {
        groupId: raw.EVENT_BUS_GROUP_ID as string,
      },
      dlt: {
        retry: {
          maxAttempts: parseIntIfExists(
            raw.EVENT_BUS_DLT_RETRY_MAX_ATTEMPTS as string,
          ) as number,
          delay: parseIntIfExists(
            raw.EVENT_BUS_DLT_RETRY_DELAY as string,
          ) as number,
        },
      },
    },
    openai: {
      api_key: raw.OPENAI_API_KEY as string,
      system_message: {
        daily: {
          all: raw.OPENAI_SYSTEM_MESSAGE_DAILY_ALL as string,
        },
        yearly: {
          chart: raw.OPENAI_SYSTEM_MESSAGE_YEARLY_CHART as string,
          general: raw.OPENAI_SYSTEM_MESSAGE_YEARLY_GENERAL as string,
          relationship: raw.OPENAI_SYSTEM_MESSAGE_YEARLY_RELATIONSHIP as string,
          wealth: raw.OPENAI_SYSTEM_MESSAGE_YEARLY_WEALTH as string,
          romantic: raw.OPENAI_SYSTEM_MESSAGE_YEARLY_ROMANTIC as string,
          health: raw.OPENAI_SYSTEM_MESSAGE_YEARLY_HEALTH as string,
          career: raw.OPENAI_SYSTEM_MESSAGE_YEARLY_CAREER as string,
          waysToImprove:
            raw.OPENAI_SYSTEM_MESSAGE_YEARLY_WAYS_TO_IMPROVE as string,
          caution: raw.OPENAI_SYSTEM_MESSAGE_YEARLY_CAUTION as string,
          questionAnswer:
            raw.OPENAI_SYSTEM_MESSAGE_YEARLY_QUESTION_ANSWER as string,
        },
      },
    },
    auth: {
      gatewayJwtSecret: raw.AUTH_GATEWAY_JWT_SECRET as string,
      gatewayJwtHeader: raw.AUTH_GATEWAY_JWT_HEADER as string,
    },
  };

  const parsedEnv = configSchema.parse(env);
  return parsedEnv;
}
