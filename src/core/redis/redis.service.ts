import { Injectable } from '@nestjs/common';
import { ChainableCommander, Redis } from 'ioredis';
import { LoggerService } from '../logger';
import { InjectRedis } from './redis.decorators';
import { HIncrByPayload, ICachingService } from './redis.interfaces';

@Injectable()
export class RedisClientService implements ICachingService {
  private _logger = new LoggerService(RedisClientService.name);
  constructor(@InjectRedis() private readonly _redis: Redis) {}

  get redisClient() {
    return this._redis;
  }

  public async hSet<T>(
    key: string,
    field: string,
    value: T,
    expireTime?: number,
  ) {
    const cacheKey = key;
    await this.redisClient.hset(cacheKey, field, JSON.stringify(value));
    if (expireTime) {
      await this.redisClient.expire(cacheKey, expireTime);
    }
  }

  public async hGet<T>(key: string, field: string) {
    const data = await this.redisClient.hget(key, field);
    try {
      const parsed = JSON.parse(data) as T;
      return parsed;
    } catch (error) {
      return data as T;
    }
  }

  public async hDel(key: string, field: string): Promise<void> {
    await this.redisClient.hdel(key, field);
  }

  public async setEx<T>(key: string, value: T, expireTime: number) {
    await this.redisClient.setex(key, expireTime, JSON.stringify(value));
  }

  public async setNx<T>(key: string, value: T, ttl?: number) {
    await this.redisClient.setnx(
      key,
      JSON.stringify(value),
      async (error, result) => {
        if (result === 1 && ttl) {
          await this.setExpire(key, ttl);
        }
        if (error) {
          this._logger.error('ERROR WHEN SETNX', error.message);
        }
      },
    );
  }

  public async setExpire(key: string, ttl: number) {
    await this.redisClient.expire(key, ttl);
  }

  public async get<T>(key: string) {
    const data = await this.redisClient.get(key);
    try {
      const parsed = JSON.parse(data) as T;
      return parsed;
    } catch (error) {
      return data as T;
    }
  }

  public async set<T>(key: string, value: T, ttl?: number) {
    const params = [];
    if (ttl && ttl > 0) {
      params.push(...['PX', ttl]);
    }
    return this.redisClient.set(key, JSON.stringify(value), ...params);
  }

  public async keys(pattern = '*') {
    return this.redisClient.keys(pattern);
  }

  public async hGetAll(key: string) {
    return this.redisClient.hgetall(key);
  }

  public async del(keys: string | string[]) {
    if (Array.isArray(keys)) {
      const cacheKeys = keys.map((key) => key);
      return this.redisClient.del(cacheKeys);
    }
    return this.redisClient.del(keys);
  }

  public async hIncrBy({ key, field, increment = 0 }: HIncrByPayload) {
    return this.redisClient.hincrby(key, field, increment);
  }

  public async multiHIncrBy(payload: HIncrByPayload[]) {
    const multi = this.redisClient.multi();
    payload.forEach(({ key, field, increment = 0 }) => {
      multi.hincrby(key, field, increment);
    });
    return multi.exec();
  }

  public async multiExec(
    fn: (multi: ChainableCommander) => void | ChainableCommander,
  ) {
    const initMulti = this.redisClient.multi();
    fn(initMulti);
    return initMulti.exec();
  }

  public async getTTL(key: string): Promise<number> {
    const keys = await this.redisClient.keys(key);
    return this._redis.ttl(keys.pop());
  }

  public async bucketGetCachedOrFetch<T>(
    key: string,
    field: string,
    dataFetcher: () => Promise<{ data: T; ttl: number }>,
    errorHandler: (error: Error) => Promise<T>,
  ): Promise<T> {
    try {
      const cachedData = await this.hGet<T>(key, field);
      if (cachedData) {
        return cachedData;
      }
      const { data, ttl } = await dataFetcher();

      if (data) {
        await this.hSet(key, field, data, ttl);
      }

      return data;
    } catch (error) {
      return errorHandler?.(error);
    }
  }

  public async getCachedOrFetch<T>(
    key: string,
    dataFetcher: () => Promise<{ data: T; ttl: number }>,
    errorHandler: (error: Error) => Promise<T>,
  ): Promise<T> {
    try {
      const cachedData = await this.get<T>(key);
      if (cachedData) {
        return cachedData;
      }
      const { data, ttl } = await dataFetcher();
      if (data && ttl) {
        await this.set(key, data, ttl);
      }
      return data;
    } catch (error) {
      return errorHandler?.(error);
    }
  }
}
