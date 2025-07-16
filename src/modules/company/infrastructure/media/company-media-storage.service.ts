import { Injectable } from '@nestjs/common';
import { MediaCollectionType } from 'src/modules/media/domain/media-collection-type.enum';
import { IMediaService } from 'src/shared/media/media.service.interface';
import { Media } from 'src/modules/media/domain/media.entity';
import { DomainMediaStorage } from 'src/modules/media/domain/domain.media.storage';
import { CompanyStorageConfig } from './company-storage.config';

@Injectable()
export class CompanyMediaStorageService implements DomainMediaStorage {
  constructor(
    private readonly mediaService: IMediaService,
    private readonly companyStorageConfig: CompanyStorageConfig
  ) {}

  getCollectionType(): MediaCollectionType {
    return MediaCollectionType.COMPANY;
  }

  async uploadMedia(multipartFile: Express.Multer.File): Promise<Media | null> {
    const storageType = this.companyStorageConfig.storage;
    const basePath = this.companyStorageConfig.basePath;

    return this.mediaService.uploadMedia(multipartFile, storageType, basePath);
  }
}
