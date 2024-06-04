import { Global, Module } from '@nestjs/common';
import { LoggerService } from './logger';
import { CoreServices, LoggerFactory } from './types';
import { MailModule } from './mail';

@Global()
@Module({
  imports: [MailModule],
  controllers: [],
  providers: [
    {
      provide: CoreServices.LoggingService,
      useFactory: (): LoggerFactory => {
        return { create: (context: string) => new LoggerService(context) };
      },
    },
  ],
  exports: [CoreServices.LoggingService, MailModule],
})
export class CoreModule {}
