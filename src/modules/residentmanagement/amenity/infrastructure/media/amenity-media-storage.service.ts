import { Injectable } from '@nestjs/common';
import { MediaCollectionType } from 'src/modules/media/domain/media-collection-type.enum';
import { IMediaService } from 'src/shared/media/media.service.interface';
import { AmenityStorageConfig } from './amenity-storage.config';
import { Media } from 'src/modules/media/domain/media.entity';
import { DomainMediaStorage } from 'src/modules/media/domain/domain.media.storage';

@Injectable()
export class AmenityMediaStorageService implements DomainMediaStorage {
  constructor(
    private readonly mediaService: IMediaService,
    private readonly amenityStorageConfig: AmenityStorageConfig
  ) {}

  getCollectionType(): MediaCollectionType {
    return MediaCollectionType.AMENITY;
  }

  async uploadMedia(multipartFile: Express.Multer.File): Promise<Media | null> {
    const storageType = this.amenityStorageConfig.storage;
    const basePath = this.amenityStorageConfig.basePath;

    return this.mediaService.uploadMedia(multipartFile, storageType, basePath);
  }
}
