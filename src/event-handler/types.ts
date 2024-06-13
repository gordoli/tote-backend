import { MailData } from 'src/core';
import { MAIL_TYPE_KEYS } from 'src/core/mail/constant';
import { Rating, User } from 'src/database';

export class SendMailPayload {
  key: MAIL_TYPE_KEYS;
  data: MailData<unknown>;
  constructor(data?: Partial<SendMailPayload>) {
    this.key = data?.key;
    this.data = data?.data;
  }
}

export class CreateFeedRatingPayload {
  rating: Rating;
  user: User;
  constructor(data: Partial<CreateFeedRatingPayload>) {
    this.rating = data.rating;
    this.user = data.user;
  }
}
