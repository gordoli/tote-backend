import { ModuleMetadata, Type } from '@nestjs/common/interfaces';
import * as Redis from 'ioredis';

export enum UnitTime {
  Seconds = 'seconds',
  Milliseconds = 'miliseconds',
}

export type RedisModuleOptions = {
  config: Redis.RedisOptions & { url?: string };
};

export interface RedisModuleOptionsFactory {
  createRedisModuleOptions(): Promise<RedisModuleOptions> | RedisModuleOptions;
}

export interface RedisModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useClass?: Type<RedisModuleOptionsFactory>;
  useExisting?: Type<RedisModuleOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<RedisModuleOptions> | RedisModuleOptions;
}

export enum CACHE_SECOND_TOKEN {
  SECONDS = 'EX',
  MILLISECONDS = 'PX',
  TIMESTAMP_SECONDS = 'EXAT',
  TIMESTAMP_MILLISECONDS = 'PXAT',
}

export type HIncrByPayload = {
  key: string;
  field: string;
  increment?: number;
};

export interface ICachingService {
  get redisClient(): Redis.Redis;
  // @ttl in milliseconds
  hSet<T>(
    key: string,
    field: string,
    value: T,
    expireTime?: number,
  ): Promise<void>;
  hGet<T>(key: string, field: string): Promise<T>;
  hDel(key: string, field: string): Promise<void>;
  set<T>(key: string, value: T, ttl?: number): Promise<'OK'>;
  setNx<T>(key: string, value: T, ttl?: number): Promise<void>;
  setEx<T>(key: string, value: T, expireTime: number): Promise<void>;
  setExpire(key: string, ttl: number): Promise<void>;
  get<T>(key: string): Promise<T>;
  keys(pattern?: string): Promise<string[]>;
  hGetAll(key: string): Promise<Record<string, string>>;
  del(keys: Redis.RedisKey | Redis.RedisKey[]): Promise<number>;
  hIncrBy(payload: HIncrByPayload): Promise<number>;
  multiHIncrBy(
    payload: HIncrByPayload[],
  ): Promise<[error: Error, result: unknown][]>;
  multiExec(
    fn: (multi: Redis.ChainableCommander) => void | Redis.ChainableCommander,
  ): Promise<[error: Error, result: unknown][]>;
  getTTL(key: string): Promise<number>;

  getCachedOrFetch<T>(
    key: string,
    dataFetcher: () => Promise<{ data: T; ttl: number }>,
    errorHandler?: (error: Error) => Promise<T>,
  ): Promise<T>;

  bucketGetCachedOrFetch<T>(
    key: string,
    field: string,
    dataFetcher: () => Promise<{ data: T; ttl: number }>,
    errorHandler?: (error: Error) => Promise<T>,
  ): Promise<T>;
}
