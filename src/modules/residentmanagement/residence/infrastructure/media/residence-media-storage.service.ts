import { Injectable } from '@nestjs/common';
import { MediaCollectionType } from 'src/modules/media/domain/media-collection-type.enum';
import { IMediaService } from 'src/shared/media/media.service.interface';
import { Media } from 'src/modules/media/domain/media.entity';
import { DomainMediaStorage } from 'src/modules/media/domain/domain.media.storage';
import { ResidenceStorageConfig } from './residence-storage.config';

@Injectable()
export class ResidenceMediaStorageService implements DomainMediaStorage {
  constructor(
    private readonly mediaService: IMediaService,
    private readonly residenceStorageConfig: ResidenceStorageConfig
  ) {}

  getCollectionType(): MediaCollectionType {
    return MediaCollectionType.RESIDENCE;
  }

  async uploadMedia(multipartFile: Express.Multer.File): Promise<Media | null> {
    const storageType = this.residenceStorageConfig.storage;
    const basePath = this.residenceStorageConfig.basePath;

    return this.mediaService.uploadMedia(multipartFile, storageType, basePath);
  }
}
