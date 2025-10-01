import { Config, configSchema } from 'src/config/config.schema';

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
    token: {
      accessTokenSecret: raw.ACCESS_TOKEN_SECRET as string,
      refreshTokenSecret: raw.REFRESH_TOKEN_SECRET as string,
      accessTokenExpiresIn: parseIntIfExists(
        raw.ACCESS_TOKEN_EXPIRES_IN as string,
      ) as number,
      refreshTokenExpiresIn: parseIntIfExists(
        raw.REFRESH_TOKEN_EXPIRES_IN as string,
      ) as number,
    },
    redis: {
      host: (raw.REDIS_HOST as string) || 'localhost',
      port: parseIntIfExists(raw.REDIS_PORT as string) || 6379,
      password: raw.REDIS_PASSWORD as string | undefined,
    },
    idp: {
      baseUrl: raw.IDP_BASE_URL as string,
      clientId: raw.IDP_CLIENT_ID as string,
      clientSecret: raw.IDP_CLIENT_SECRET as string,
    },
    score: {
      mean: parseIntIfExists(raw.SCORE_MEAN as string) ?? 70,
      stdDev: parseIntIfExists(raw.SCORE_STD_DEV as string) ?? 10,
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
  };

  const parsedEnv = configSchema.parse(env);
  return parsedEnv;
}
