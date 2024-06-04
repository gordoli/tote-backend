import { Inject } from '@nestjs/common';
import { getRedisConnectionToken } from './redis.utils';
import { CACHING_SERVICE_TOKEN } from './redis.constants';

export const InjectRedis = (connection?: string) => {
  return Inject(getRedisConnectionToken(connection));
};

export const InjectCaching = () => {
  return Inject(CACHING_SERVICE_TOKEN);
};
