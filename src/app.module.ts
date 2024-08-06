import {
  Global,
  MiddlewareConsumer,
  Module,
  RequestMethod,
} from '@nestjs/common';
import { CoreModule, RedisModule } from './core';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database';
import { AppService } from './app.service';
import { EventHandlerModule } from './event-handler';
import { LoggerMiddleware } from './middlewares';
import { AppController } from './app.controller';
import { HealthModule } from './health-check';
import {
  FilesModule,
  UsersModule,
  FollowsModule,
  AuthModule,
  CategoryModule,
  BrandsModule,
  RankProductsModule,
  FeedsModule,
  WishListsModule,
  NotificationsModule,
} from './domain';

@Global()
@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development', '.env'],
      isGlobal: true,
    }),
    HealthModule,
    EventHandlerModule,
    CoreModule,
    DatabaseModule,
    RedisModule.forRootAsync({
      useFactory: () => ({
        // https://docs.railway.app/guides/private-networking#known-configuration-requirements-for-ipv6
        // Need `?family=0` to support IvP4 and IvP6 on Railway
        config: {
          url: `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}?family=0:${process.env.REDIS_PORT}`,
          keyPrefix: 'tote:',
        },
      }),
    }),
    AuthModule,
    FilesModule,
    UsersModule,
    FollowsModule,
    CategoryModule,
    BrandsModule,
    RankProductsModule,
    FeedsModule,
    WishListsModule,
    NotificationsModule,
  ],
  providers: [AppService],
  exports: [CoreModule],
})
export class AppModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
