import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { LoggerService } from '../logger';
import { MailData, MAIL_TEMPLATE } from './types';
import { MAIL_TYPE, MAIL_TYPE_KEYS } from './constant';

@Injectable()
export class MailService {
  private _logger = new LoggerService(MailService.name);
  constructor(private _mailerService: MailerService) {}

  public async sendMail<T>(key: MAIL_TYPE_KEYS, payload: MailData<T>) {
    try {
      const mailType = MAIL_TYPE[key];
      if (!mailType) {
        throw new Error(`Mail type ${key} not implemented!`);
      }
      const { data, to, ...rest } = payload;
      const options = {
        to,
        subject: `[No reply] ${mailType.subject}`,
        template: mailType.template,
        context: data,
      };
      for (const key in rest) {
        if (rest[key]) {
          options[key] = rest[key];
        }
      }
      const sendMail = await this._mailerService.sendMail(options);
      console.log('Response send mail', sendMail);
    } catch (error) {
      console.log('Send mail error', error);
    }
  }

  public async testSendMail(data: MailData) {
    try {
      const sendMail = await this._mailerService.sendMail({
        to: data.to,
        subject: 'Tote',
        template: MAIL_TEMPLATE.TEST,
      });
      console.log('RESPONSE SEND MAIL TEST', sendMail);
      return sendMail;
    } catch (error) {
      console.log('SEND TEST MAIL ERROR', error);
    }
  }
}
