import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EVENTS } from 'src/constants';
import { MailService } from 'src/core/mail/mail.service';
import { LoggerService } from '../core/logger';
import { CreateFeedRatingPayload, SendMailPayload } from './types';
import { FeedActivitiesService } from 'src/domain';

@Injectable()
export class EventHandlerService {
  private _logger = new LoggerService(EventHandlerService.name);
  constructor(
    private _mailService: MailService,
    private _feedActivitiesService: FeedActivitiesService,
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
  public async onCreateRating(payload: CreateFeedRatingPayload) {
    this._logger.debug('On create rating feed payload ', payload);
    try {
      await this._feedActivitiesService.createRatingFeed(
        payload.rating,
        payload.user,
      );
    } catch (error) {
      this._logger.error('Have error when create rating feed ', error.message);
    }
  }
}
