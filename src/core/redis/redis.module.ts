import { DynamicModule, Global, Module } from '@nestjs/common';
import { RedisCoreModule } from './redis.core-module';
import {
  RedisModuleAsyncOptions,
  RedisModuleOptions,
} from './redis.interfaces';
import { RedisClientService } from './redis.service';
import { CACHING_SERVICE_TOKEN, REDIS_CONFIG_OPTIONS } from './redis.constants';

@Global()
@Module({
  providers: [
    {
      useClass: RedisClientService,
      provide: CACHING_SERVICE_TOKEN,
    },
  ],
  exports: [CACHING_SERVICE_TOKEN],
})
export class RedisModule {
  public static forRoot(
    options: RedisModuleOptions,
    connection?: string,
  ): DynamicModule {
    return {
      module: RedisModule,
      imports: [RedisCoreModule.forRoot(options, connection)],
      exports: [RedisCoreModule],
      providers: [
        {
          provide: REDIS_CONFIG_OPTIONS,
          useValue: options,
        },
      ],
    };
  }

  public static forRootAsync(
    options: RedisModuleAsyncOptions,
    connection?: string,
  ): DynamicModule {
    return {
      module: RedisModule,
      imports: [RedisCoreModule.forRootAsync(options, connection)],
      exports: [RedisCoreModule],
      providers: [
        {
          provide: REDIS_CONFIG_OPTIONS,
          useValue: options,
        },
      ],
    };
  }
}
