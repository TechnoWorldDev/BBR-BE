import { Injectable } from '@nestjs/common';
import * as mime from 'mime-types';
import { MediaStorageType } from './media-storage-type.enum';
import { Media } from '../../../modules/media/domain/media.entity';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { AwsProperties } from 'src/shared/aws/aws-properties';
import { MediaStorage } from '../../../modules/media/domain/media.storage.interface';
import { MediaLibraryS3Configuration } from '../config/media-library-s3.configuration';
import { Readable } from 'typeorm/platform/PlatformTools';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { FileUploadCompletedEvent } from '../../../modules/media/domain/event/file-upload-completed.event';
import { FileUploadErrorEvent } from '../../../modules/media/domain/event/file-upload-error.event';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class S3MediaStorage implements MediaStorage {
  private s3: S3Client;
  private readonly bucket: string;

  constructor(
    private readonly eventPublisher: EventEmitter2,
    private readonly awsProperties: AwsProperties,
    private readonly mediaConfig: MediaLibraryS3Configuration
  ) {
    this.bucket = this.mediaConfig.getBucket();

    this.s3 = new S3Client({
      region: this.awsProperties.region,
      credentials: {
        accessKeyId: this.awsProperties.accessKey,
        secretAccessKey: this.awsProperties.secretKey,
      },
    });
  }

  @LogMethod()
  getType(): MediaStorageType {
    return MediaStorageType.S3;
  }

  @LogMethod()
  async upload(savedMedia: Media, multipartFile: Express.Multer.File): Promise<void> {
    const params = {
      Bucket: this.bucket,
      Key: savedMedia.getPath(),
      Body: multipartFile.buffer,
      ContentType: multipartFile.mimetype,
      ContentLength: multipartFile.size,
    };

    try {
      await this.s3.send(new PutObjectCommand(params));
      this.eventPublisher.emit(
        'file.upload.completed',
        new FileUploadCompletedEvent(savedMedia.id)
      );
    } catch (error) {
      this.eventPublisher.emit('file.upload.error', new FileUploadErrorEvent(savedMedia.id));
      throw new Error('Media upload failed');
    }
  }

  @LogMethod()
  async uploadStream(savedMedia: Media, dataStream: NodeJS.ReadableStream): Promise<void> {
    const params = {
      Bucket: this.bucket,
      Key: savedMedia.getPath(),
      Body: Readable.from(dataStream),
      ContentType: mime.lookup(savedMedia.getPath()) || 'application/octet-stream',
    };

    try {
      await this.s3.send(new PutObjectCommand(params));
      this.eventPublisher.emit(
        'file.upload.completed',
        new FileUploadCompletedEvent(savedMedia.id)
      );
    } catch (error) {
      this.eventPublisher.emit('file.upload.error', new FileUploadErrorEvent(savedMedia.id));
      throw new Error('Media upload failed');
    }
  }

  @LogMethod()
  async fetchContent(path: string): Promise<Buffer> {
    try {
      const params = { Bucket: this.bucket, Key: path };
      const command = new GetObjectCommand(params);
      const data = await this.s3.send(command);

      const chunks: Uint8Array[] = [];
      for await (const chunk of data.Body as Readable) {
        chunks.push(chunk);
      }

      const buffer = Buffer.concat(chunks);

      return buffer;
    } catch (error) {
      throw new Error('Content not found or fetch error');
    }
  }

  @LogMethod()
  async getExternalUrl(media: Media): Promise<string> {
    const params = {
      Bucket: this.bucket,
      Key: media.externalId,
    };

    try {
      const url = await getSignedUrl(this.s3, new GetObjectCommand(params), { expiresIn: 3600 });
      return url;
    } catch (error) {
      throw new Error('Error generating external URL');
    }
  }

  @LogMethod()
  async delete(url: string): Promise<void> {
    const key = url.substring(1);

    const params = {
      Bucket: this.bucket,
      Key: key,
    };

    try {
      await this.s3.send(new DeleteObjectCommand(params));
    } catch (error) {
      throw new Error('Error deleting file');
    }
  }

  @LogMethod()
  async generateTemporalURL(media: Media): Promise<string> {
    if (!media || !media.getPath()) {
      return 'invalid_url';
    }

    const params = {
      Bucket: this.bucket,
      Key: media.getPath(),
      Expires: this.mediaConfig.getTemporalUrlDuration(),
    };

    try {
      const url = await getSignedUrl(this.s3, new GetObjectCommand(params));
      return url;
    } catch (error) {
      throw new Error('Error generating temporal URL');
    }
  }
}
