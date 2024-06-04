import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RepositoryModule } from './repositories';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        return {
          type: 'postgres',
          host: configService.get('PG_HOST'),
          port: +configService.get('PG_PORT'),
          username: configService.get('PG_USER'),
          password: configService.get('PG_PASSWORD'),
          database: configService.get('PG_DB'),
          entities: [__dirname + '/../**/*.entity.js'],
          entityPrefix: 'tote_',
        };
      },
    }),
    RepositoryModule,
  ],
  exports: [TypeOrmModule, RepositoryModule],
})
export class DatabaseModule {}
