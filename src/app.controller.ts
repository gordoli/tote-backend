import { Controller, Get } from '@nestjs/common';
import { InjectCaching, ICachingService } from './core';
import { BaseController } from './library';

@Controller()
export class AppController extends BaseController {
  constructor(@InjectCaching() private _cachingService: ICachingService) {
    super(AppController.name);
  }
  @Get()
  public async getHello() {
    this._logger.debug('get Hello');
    await this._cachingService.set('hello', 'word');
    return 'Hello word!';
  }
}
