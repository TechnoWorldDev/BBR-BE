import { Inject, Injectable } from '@nestjs/common';
import { MimeType } from 'mime-types';
import { Readable } from 'stream';
import { MediaRepositoryImpl } from 'src/modules/media/infrastructure/media.repository';
import { MediaStorageType } from './storage/media-storage-type.enum';
import { MediaStorage } from 'src/modules/media/domain/media.storage.interface';
import { Media } from 'src/modules/media/domain/media.entity';
import { MediaUploadStatus } from 'src/modules/media/domain/media-upload-status.enum';
import { LogMethod } from '../infrastructure/logger/log.decorator';
import { IMediaRepository } from 'src/modules/media/domain/media.repository.interface';
import { randomUUID } from 'crypto';
import { IMediaService } from './media.service.interface';

@Injectable()
export class MediaServiceImpl implements IMediaService {
  private readonly mediaStorages: Map<MediaStorageType, MediaStorage>;

  constructor(
    private readonly mediaRepository: IMediaRepository,
    @Inject('S3_MEDIA_STORAGE_SERVICE') s3Storage: MediaStorage,
    @Inject('LOCAL_MEDIA_STORAGE_SERVICE') localStorage: MediaStorage
  ) {
    this.mediaStorages = new Map();
    this.mediaStorages.set(MediaStorageType.S3, s3Storage);
    this.mediaStorages.set(MediaStorageType.LOCAL, localStorage);
  }

  @LogMethod()
  async uploadMedia(
    multipartFile: Express.Multer.File,
    storage: MediaStorageType,
    basePath: string
  ): Promise<Media | null> {
    const id = randomUUID();

    const media = await Media.create({
      id:id,
      originalFileName: multipartFile.originalname,
      mimeType: multipartFile.mimetype as MimeType,
      size: multipartFile.size,
      basePath,
      storage,
      externalId:basePath + "/" + id + "/" + multipartFile.originalname,
      uploadStatus: MediaUploadStatus.IN_PROGRESS,
    });

    const mediaStorage = this.mediaStorages.get(storage);
    if (mediaStorage) {
      await mediaStorage.upload(media, multipartFile);
    }

    return media;
  }

  @LogMethod()
  async uploadMediaWithStream(
    originalFilename: string,
    size: number,
    contentType: MimeType,
    storage: MediaStorageType,
    basePath: string,
    dataStream: Readable
  ): Promise<Media | null> {
    const media = await Media.create({
      originalFileName: originalFilename,
      mimeType: contentType,
      size,
      basePath,
      storage,
      uploadStatus: MediaUploadStatus.IN_PROGRESS,
    });

    const mediaStorage = this.mediaStorages.get(storage);
    if (mediaStorage) {
      await mediaStorage.uploadStream(media, dataStream);
    }

    return media;
  }

  @LogMethod()
  async findById(id: string): Promise<Media | null> {
    return (await this.mediaRepository.findById(id)) || null;
  }

  @LogMethod()
  async findContentById(media: Media): Promise<Buffer> {
    const mediaStorage = this.mediaStorages.get(media.storage);
    if (mediaStorage) {
      return await mediaStorage.fetchContent(media.getPath());
    }
    return Buffer.from([]);
  }

  @LogMethod()
  async addTemporalUrl(media: Media): Promise<void> {
    if (media) {
      const securedUrl = await this.generateTemporalURL(media);
      media.addSecuredUrl(securedUrl);
    }
  }

  @LogMethod()
  async addTemporalUrls(medias: Media[]): Promise<void> {
    for (const media of medias) {
      await this.addTemporalUrl(media);
    }
  }

  @LogMethod()
  async generateTemporalURL(media: Media): Promise<string> {
    if (!media) return 'invalid_url';
    const mediaStorage = this.mediaStorages.get(media.storage);
    if (mediaStorage) {
      return await mediaStorage.generateTemporalURL(media);
    }
    return 'invalid_url';
  }

  @LogMethod()
  async deleteUnusedMediaCreatedAfterDate(date: Date): Promise<void> {
    const unusedMediaList = await this.mediaRepository.fetchUnusedMediaCreatedAfter(date);

    if (!unusedMediaList.length) {
      return;
    }

    for (const media of unusedMediaList) {
      if (media.getPath() != null) {
        const mediaStorage = this.mediaStorages.get(media.storage);
        if (mediaStorage) {
          await mediaStorage.delete(media.getPath());
        }
      }
    }

    const mediaIds = unusedMediaList.map((media) => media.id);
    await this.mediaRepository.deleteByIds(mediaIds);
  }
}
