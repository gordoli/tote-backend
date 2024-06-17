import { MailData } from 'src/core';
import { MAIL_TYPE_KEYS } from 'src/core/mail/constant';
import { RankProduct, User } from 'src/database';

export class SendMailPayload {
  key: MAIL_TYPE_KEYS;
  data: MailData<unknown>;
  constructor(data?: Partial<SendMailPayload>) {
    this.key = data?.key;
    this.data = data?.data;
  }
}

export class CreateFeedRankProductPayload {
  rankProduct: RankProduct;
  user: User;
  constructor(data: Partial<CreateFeedRankProductPayload>) {
    this.rankProduct = data.rankProduct;
    this.user = data.user;
  }
}
