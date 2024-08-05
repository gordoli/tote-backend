import {
  Controller,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { User } from 'src/database';
import { CurrentUser } from 'src/domain/auth';
import { BaseController } from 'src/library';
import { FilesService } from '../services';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Files')
@Controller('files')
// TODO: AuthGuard
export class FilesController extends BaseController {
  constructor(private _filesService: FilesService) {
    super();
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  public async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: User,
  ) {
    const url = await this._filesService.uploadFile(file, user);
    return url;
  }
}
