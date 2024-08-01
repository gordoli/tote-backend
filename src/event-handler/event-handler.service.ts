import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EVENTS } from 'src/constants';
import { MailService } from 'src/core/mail/mail.service';
import { FEED_TYPE } from 'src/database';
import { FeedsService } from 'src/domain';
import { LoggerService } from '../core/logger';
import {
  FEED_PAYLOAD_ACTION,
  HandleFeedPayload,
  SendMailPayload,
} from './types';

@Injectable()
export class EventHandlerService {
  private _logger = new LoggerService(EventHandlerService.name);
  constructor(
    private _mailService: MailService,
    private _feedsService: FeedsService,
  ) {}

  @OnEvent(EVENTS.SEND_MAIL)
  public async onSendMail(payload: SendMailPayload) {
    this._logger.debug('On send mail payload ', payload);
    try {
      const { key, data } = payload;
      await this._mailService.sendMail(key, data);
      this._logger.debug('Send mail done');
    } catch (error) {
      this._logger.error('Have error when send mail ', error.message);
    }
  }

  @OnEvent(EVENTS.FEED_ACTIVITY.HANDLE)
  public async onFeedHandler(payload: HandleFeedPayload) {
    this._logger.debug('On create rankProduct feed payload ', payload);
    this._logger.debug('Payload action for handler', payload.action);
    try {
      switch (payload.action) {
        case FEED_PAYLOAD_ACTION.ADD_RANK_PRODUCT:
          await this._feedsService.createRatingFeed(payload.data, payload.user);
          break;

        case FEED_PAYLOAD_ACTION.ADD_WISHLIST:
          await this._feedsService.createWishlistFeed(
            payload.data,
            payload.user,
          );
          break;

        case FEED_PAYLOAD_ACTION.REMOVE_WISHLIST:
          await this._feedsService.deleteWishlistFeed(
            payload.data,
            payload.user,
          );
          break;

        default:
          break;
      }
    } catch (error) {
      this._logger.error('Have error when create rankProduct feed ', error);
    }
  }
}
