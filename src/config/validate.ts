import { Config, configSchema } from 'src/schemas/config.schema';

export function validate(raw: Record<string, unknown>) {
  const env: Config = {
    server: {
      nodeEnv: raw.NODE_ENV as string,
      port: parseInt((raw.PORT as string) || '3000'),
    },
    openai: {
      api_key: raw.OPENAI_API_KEY as string,
    },
    jwt: {
      secret: raw.JWT_SECRET as string,
    },
  };

  const parsedEnv = configSchema.parse(env);
  return parsedEnv;
}
