import { Global, Module } from '@nestjs/common';
import { FilesController } from './controllers';
import { FilesService } from './services';

@Global()
@Module({
  controllers: [FilesController],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}
