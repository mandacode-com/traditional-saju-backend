import { configSchema } from './config.schema';
import { parseIntValue, parseRedisConfig } from './parsers';

export function validate(env: Record<string, unknown>) {
  const config = {
    server: {
      nodeEnv: env.NODE_ENV as string | undefined,
      port: parseIntValue(env.PORT as string),
    },
    token: {
      accessTokenSecret: env.ACCESS_TOKEN_SECRET as string,
      refreshTokenSecret: env.REFRESH_TOKEN_SECRET as string,
      accessTokenExpiresIn: parseIntValue(
        env.ACCESS_TOKEN_EXPIRES_IN as string,
      ),
      refreshTokenExpiresIn: parseIntValue(
        env.REFRESH_TOKEN_EXPIRES_IN as string,
      ),
    },
    redis: parseRedisConfig(env),
    idp: {
      authUrl: env.IDP_AUTH_URL as string,
      userUrl: env.IDP_USER_URL as string,
      clientId: env.IDP_CLIENT_ID as string,
      clientSecret: env.IDP_CLIENT_SECRET as string,
    },
    score: {
      mean: parseIntValue(env.SCORE_MEAN as string),
      stdDev: parseIntValue(env.SCORE_STD_DEV as string),
    },
    openai: {
      api_key: env.OPENAI_API_KEY as string,
      system_message: {
        daily: {
          all: env.OPENAI_SYSTEM_MESSAGE_DAILY_ALL as string | undefined,
        },
        yearly: {
          chart: env.OPENAI_SYSTEM_MESSAGE_YEARLY_CHART as string | undefined,
          general: env.OPENAI_SYSTEM_MESSAGE_YEARLY_GENERAL as
            | string
            | undefined,
          relationship: env.OPENAI_SYSTEM_MESSAGE_YEARLY_RELATIONSHIP as
            | string
            | undefined,
          wealth: env.OPENAI_SYSTEM_MESSAGE_YEARLY_WEALTH as string | undefined,
          romantic: env.OPENAI_SYSTEM_MESSAGE_YEARLY_ROMANTIC as
            | string
            | undefined,
          health: env.OPENAI_SYSTEM_MESSAGE_YEARLY_HEALTH as string | undefined,
          career: env.OPENAI_SYSTEM_MESSAGE_YEARLY_CAREER as string | undefined,
          waysToImprove: env.OPENAI_SYSTEM_MESSAGE_YEARLY_WAYS_TO_IMPROVE as
            | string
            | undefined,
          caution: env.OPENAI_SYSTEM_MESSAGE_YEARLY_CAUTION as
            | string
            | undefined,
          questionAnswer: env.OPENAI_SYSTEM_MESSAGE_YEARLY_QUESTION_ANSWER as
            | string
            | undefined,
        },
      },
    },
  };

  return configSchema.parse(config);
}
