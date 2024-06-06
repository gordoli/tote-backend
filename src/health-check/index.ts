import { Module } from '@nestjs/common';
import { Controller, Get, Res } from '@nestjs/common';
import { BaseController } from 'src/library';
import { Response } from 'express';

@Controller('health')
export class HealthCheckController extends BaseController {
  @Get()
  health(@Res() response: Response) {
    return response.status(200).send('ok');
  }
}

@Module({
  controllers: [HealthCheckController],
  providers: [],
  exports: [],
})
export class HealthModule {}
