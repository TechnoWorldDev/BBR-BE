import { Injectable } from '@nestjs/common';
import { MediaCollectionType } from 'src/modules/media/domain/media-collection-type.enum';
import { IMediaService } from 'src/shared/media/media.service.interface';
import { ResidenceUnitStorageConfig } from './residence-unit-storage-config.service';
import { Media } from 'src/modules/media/domain/media.entity';
import { DomainMediaStorage } from 'src/modules/media/domain/domain.media.storage';

@Injectable()
export class ResidenceUnitMediaStorageService implements DomainMediaStorage {
  constructor(
    private readonly mediaService: IMediaService,
    private readonly residenceUnitStorageConfig: ResidenceUnitStorageConfig
  ) {}

  getCollectionType(): MediaCollectionType {
    return MediaCollectionType.RESIDENCE_UNIT;
  }

  async uploadMedia(multipartFile: Express.Multer.File): Promise<Media | null> {
    const storageType = this.residenceUnitStorageConfig.storage;
    const basePath = this.residenceUnitStorageConfig.basePath;

    return this.mediaService.uploadMedia(multipartFile, storageType, basePath);
  }
}
