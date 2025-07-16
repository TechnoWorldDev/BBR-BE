import { Injectable } from '@nestjs/common';
import { DomainMediaStorage } from 'src/modules/media/domain/domain.media.storage';
import { MediaCollectionType } from 'src/modules/media/domain/media-collection-type.enum';
import { Media } from 'src/modules/media/domain/media.entity';
import { IMediaService } from 'src/shared/media/media.service.interface';
import { UserStorageConfig } from './user-storage.config';

@Injectable()
export class UserMediaStorageService implements DomainMediaStorage {
  constructor(
    private readonly mediaService: IMediaService,
    private readonly userStorageConfig: UserStorageConfig
  ) {}

  getCollectionType(): MediaCollectionType {
    return MediaCollectionType.USER;
  }

  async uploadMedia(multipartFile: Express.Multer.File): Promise<Media | null> {
    const storageType = this.userStorageConfig.storage;
    const basePath = this.userStorageConfig.basePath;

    return this.mediaService.uploadMedia(multipartFile, storageType, basePath);
  }
}
