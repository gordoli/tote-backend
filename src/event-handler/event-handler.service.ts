import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EVENTS } from 'src/constants';
import { MailService } from 'src/core/mail/mail.service';
import { LoggerService } from '../core/logger';
import { CreateFeedRankProductPayload, SendMailPayload } from './types';
import { FeedsService } from 'src/domain';

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

  @OnEvent(EVENTS.FEED_ACTIVITY.CREATE_RATING)
  public async onCreateRating(payload: CreateFeedRankProductPayload) {
    this._logger.debug('On create rankProduct feed payload ', payload);
    try {
      await this._feedsService.createRatingFeed(
        payload.rankProduct,
        payload.user,
      );
    } catch (error) {
      this._logger.error(
        'Have error when create rankProduct feed ',
        error.message,
      );
    }
  }
}
