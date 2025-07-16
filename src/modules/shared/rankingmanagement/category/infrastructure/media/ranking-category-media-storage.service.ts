import { Injectable } from '@nestjs/common';
import { MediaCollectionType } from 'src/modules/media/domain/media-collection-type.enum';
import { IMediaService } from 'src/shared/media/media.service.interface';
import { RankingCategoryStorageConfig } from './ranking-category-storage.config';
import { Media } from 'src/modules/media/domain/media.entity';
import { DomainMediaStorage } from 'src/modules/media/domain/domain.media.storage';

@Injectable()
export class RankingCategoryMediaStorageService implements DomainMediaStorage {
  constructor(
    private readonly mediaService: IMediaService,
    private readonly rankingCategoryStorageConfig: RankingCategoryStorageConfig
  ) {}

  getCollectionType(): MediaCollectionType {
    return MediaCollectionType.RANKING_CATEGORY;
  }

  async uploadMedia(multipartFile: Express.Multer.File): Promise<Media | null> {
    const storageType = this.rankingCategoryStorageConfig.storage;
    const basePath = this.rankingCategoryStorageConfig.basePath;

    return this.mediaService.uploadMedia(multipartFile, storageType, basePath);
  }
}
