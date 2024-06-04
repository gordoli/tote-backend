import { RedisModuleOptions, UnitTime } from './redis.interfaces';
import { Redis } from 'ioredis';
import {
  REDIS_MODULE_CONNECTION,
  REDIS_MODULE_CONNECTION_TOKEN,
  REDIS_MODULE_OPTIONS_TOKEN,
} from './redis.constants';

export function getRedisOptionsToken(connection?: string): string {
  return `${
    connection || REDIS_MODULE_CONNECTION
  }_${REDIS_MODULE_OPTIONS_TOKEN}`;
}

export function getRedisConnectionToken(connection?: string): string {
  return `${
    connection || REDIS_MODULE_CONNECTION
  }_${REDIS_MODULE_CONNECTION_TOKEN}`;
}

export function createRedisConnection(options: RedisModuleOptions) {
  const { config } = options;
  if (config.url) {
    return new Redis(config.url, config);
  } else {
    return new Redis(config);
  }
}

export const convertUnitTime = (time: number, targetUnit: UnitTime) => {
  if (targetUnit === UnitTime.Seconds) {
    return time >= 1000 ? time / 1000 : time;
  }
  if (targetUnit === UnitTime.Milliseconds) {
    return time < 1000 ? time * 1000 : time;
  }
};
