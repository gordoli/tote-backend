import {
  CopyObjectCommand,
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { COMMON_CONSTANT } from 'src/constants';
import { LoggerService } from 'src/core';
import { User } from 'src/database';

@Injectable()
export class FilesService {
  private _logger = new LoggerService(FilesService.name);
  private _s3Client: S3Client;
  private readonly _urlPrefix: string;
  private readonly _s3Bucket: string;
  constructor() {
    this._s3Client = new S3Client({
      region: process.env.REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
    this._s3Bucket = process.env.S3_BUCKET;
    this._urlPrefix = `https://${this._s3Bucket}.s3.${process.env.REGION}.amazonaws.com`;
  }

  public async uploadFile(file: Express.Multer.File, user: User) {
    const fileExt = file.originalname.split('.').pop();
    const filePath = `${
      COMMON_CONSTANT.FOLDER.TEMPORARY
    }/${Date.now()}.${fileExt}`;
    this._logger.debug(`User ${user?.id} is uploading file `, filePath);
    const command = new PutObjectCommand({
      Bucket: this._s3Bucket,
      Body: file.buffer,
      Key: filePath,
      ContentType: file.mimetype,
    });

    await this._s3Client.send(command);
    return this.getUrl(filePath);
  }

  public async storePermanent(path: string, newFolder: string) {
    const filePath = this.getFilePath(path);
    const newFileKey = newFolder + '/' + filePath.split('/')[1];
    this._logger.debug(`Store permanent path ${path} to folder `, newFolder);
    const command = new CopyObjectCommand({
      Bucket: this._s3Bucket,
      CopySource: '/' + this._s3Bucket + '/' + filePath,
      Key: newFileKey,
    });
    await this._s3Client.send(command);
    return this.getUrl(newFileKey);
  }

  public async permanentlyRemove(path: string): Promise<void> {
    const fileKey = this.getFilePath(path);
    const command = new DeleteObjectCommand({
      Bucket: this._s3Bucket,
      Key: fileKey,
    });
    await this._s3Client.send(command);
  }

  public getFilePath(path: string) {
    return path.replace(`${this._urlPrefix}/`, '').split('?')[0];
  }

  public getUrl(path: string): string {
    const filePath = this.getFilePath(path);
    return `${this._urlPrefix}/${filePath}`;
  }
}
