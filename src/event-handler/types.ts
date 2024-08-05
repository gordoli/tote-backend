import { MailData } from 'src/core';
import { MAIL_TYPE_KEYS } from 'src/core/mail/constant';
import { Product, User, WishList } from 'src/database';

export class SendMailPayload {
  key: MAIL_TYPE_KEYS;
  data: MailData<unknown>;
  constructor(data?: Partial<SendMailPayload>) {
    this.key = data?.key;
    this.data = data?.data;
  }
}

export enum FEED_PAYLOAD_ACTION {
  ADD_WISHLIST = 'add_wishlist',
  REMOVE_WISHLIST = 'remove_wishlist',
  ADD_RANK_PRODUCT = 'add_rank_product',
}
export type BaseFeedPayload = {
  user: User;
};

export type FeedData =
  | {
      data: WishList;
      action:
        | FEED_PAYLOAD_ACTION.ADD_WISHLIST
        | FEED_PAYLOAD_ACTION.REMOVE_WISHLIST;
    }
  | {
      data: Product;
      action: FEED_PAYLOAD_ACTION.ADD_RANK_PRODUCT;
    };

// Combined type for handling feed payload
export type HandleFeedPayload = BaseFeedPayload & FeedData;
