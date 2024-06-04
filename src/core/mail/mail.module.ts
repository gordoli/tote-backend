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
            host: 'smtp.mailgun.org',
            port: 587,
            ignoreTLS: false,
            secure: false,
            auth: {
              user: configService.get('MAILGUN_USER'),
              pass: configService.get('MAILGUN_PASS'),
            },
          },
          defaults: {
            from: `"No Reply" <no-reply@xxx>`,
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
