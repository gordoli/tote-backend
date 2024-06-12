import { MailData } from 'src/core';
import { MAIL_TYPE_KEYS } from 'src/core/mail/constant';

export class SendMailPayload {
  key: MAIL_TYPE_KEYS;
  data: MailData<unknown>;
  constructor(data?: Partial<SendMailPayload>) {
    this.key = data?.key;
    this.data = data?.data;
  }
}
