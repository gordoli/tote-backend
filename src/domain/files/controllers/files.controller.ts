import {
  Controller,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { User } from 'src/database';
import { CurrentUser, JwtAuthUserGuard } from 'src/domain/auth';
import { BaseController } from 'src/library';
import { FilesService } from '../services';

@Controller('files')
@UseGuards(JwtAuthUserGuard)
export class FilesController extends BaseController {
  constructor(private _filesService: FilesService) {
    super();
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  public async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Res() response: Response,
    @CurrentUser() user: User,
  ) {
    const url = await this._filesService.uploadFile(file, user);
    this.responseCustom(response, url);
  }
}
