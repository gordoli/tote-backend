import { Global, Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        return {
          transport: {
            host: configService.get('MAILER_HOST'),
            port: +configService.get('MAILER_PORT'),
            auth: {
              user: configService.get('MAILER_USER'),
              pass: configService.get('MAILER_PASS'),
            },
          },
          defaults: {
            from: `"No Reply" <${configService.get('MAILER_SENDER')}>`,
          },
          template: {
            dir: process.cwd() + '/src/templates',
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
    }),
  ],
  controllers: [],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
