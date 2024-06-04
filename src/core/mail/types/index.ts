import { ISendMailOptions } from '@nestjs-modules/mailer';

export type MailData<T = string> = {
  to: string | string[];
  data: T;
} & Partial<ISendMailOptions>;

export enum MAIL_TEMPLATE {
  RESET_PASSWORD = 'reset-password',
  FORGOT_PASSWORD = 'forgot-password-otp',
  VERIFY_EMAIL = 'verify-email-otp',
  TEST = 'test',
}
