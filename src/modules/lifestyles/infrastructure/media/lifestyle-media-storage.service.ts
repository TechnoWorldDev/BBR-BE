import { Injectable } from '@nestjs/common';
import { DomainMediaStorage } from 'src/modules/media/domain/domain.media.storage';
import { MediaCollectionType } from 'src/modules/media/domain/media-collection-type.enum';
import { Media } from 'src/modules/media/domain/media.entity';
import { IMediaService } from 'src/shared/media/media.service.interface';
import { LifestyleStorageConfig } from './lifestyle-storage.config';

@Injectable()
export class LifestyleMediaStorageService implements DomainMediaStorage {
  constructor(
    private readonly mediaService: IMediaService,
    private readonly lifestyleStorageConfig: LifestyleStorageConfig
  ) {}

  getCollectionType(): MediaCollectionType {
    return MediaCollectionType.LIFESTYLE;
  }

  async uploadMedia(multipartFile: Express.Multer.File): Promise<Media | null> {
    const storageType = this.lifestyleStorageConfig.storage;
    const basePath = this.lifestyleStorageConfig.basePath;

    return this.mediaService.uploadMedia(multipartFile, storageType, basePath);
  }
}
