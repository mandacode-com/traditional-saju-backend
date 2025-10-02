import { parseIntValue } from './env.parser';

interface RedisSentinel {
  host: string;
  port: number;
}

const parseSentinels = (sentinelsStr: string): RedisSentinel[] => {
  return sentinelsStr.split(',').map((sentinel) => {
    const [host, portStr] = sentinel.trim().split(':');
    const port = parseIntValue(portStr);

    if (!host || port === undefined) {
      throw new Error(
        `Invalid sentinel format: ${sentinel}. Expected format: host:port`,
      );
    }

    return { host, port };
  });
};

export const parseRedisConfig = (env: Record<string, unknown>) => {
  const mode = env.REDIS_MODE as string | undefined;

  if (mode === 'sentinel') {
    const sentinelsStr = env.REDIS_SENTINELS as string;

    if (!sentinelsStr) {
      throw new Error(
        'REDIS_SENTINELS is required when REDIS_MODE=sentinel. Format: host1:port1,host2:port2',
      );
    }

    return {
      mode: 'sentinel' as const,
      sentinels: parseSentinels(sentinelsStr),
      name: env.REDIS_SENTINEL_NAME as string,
      password: env.REDIS_PASSWORD as string | undefined,
      sentinelPassword: env.REDIS_SENTINEL_PASSWORD as string | undefined,
      db: parseIntValue(env.REDIS_DB as string),
    };
  }

  return {
    mode: mode as 'standalone' | undefined,
    host: env.REDIS_HOST as string | undefined,
    port: parseIntValue(env.REDIS_PORT as string),
    password: env.REDIS_PASSWORD as string | undefined,
    db: parseIntValue(env.REDIS_DB as string),
  };
};
