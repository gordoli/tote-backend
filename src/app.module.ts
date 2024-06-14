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
  RatingsModule,
  FeedActivitiesModule,
  CollectionsModule,
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
        config: {
          url: `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
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
    RatingsModule,
    FeedActivitiesModule,
    CollectionsModule,
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
