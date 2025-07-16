import { Injectable } from '@nestjs/common';
import { MediaCollectionType } from 'src/modules/media/domain/media-collection-type.enum';
import { IMediaService } from 'src/shared/media/media.service.interface';
import { ClaimProfileContactFormStorageConfig } from './claim-profile-contact-form-storage-config.service';
import { Media } from 'src/modules/media/domain/media.entity';
import { DomainMediaStorage } from 'src/modules/media/domain/domain.media.storage';

@Injectable()
export class ClaimProfileContactFormMediaStorageService implements DomainMediaStorage {
  constructor(
    private readonly mediaService: IMediaService,
    private readonly contactFormStorageConfig: ClaimProfileContactFormStorageConfig
  ) {}

  getCollectionType(): MediaCollectionType {
    return MediaCollectionType.CLAIM_PROFILE_CONTACT_FORM;
  }

  async uploadMedia(multipartFile: Express.Multer.File): Promise<Media | null> {
    const storageType = this.contactFormStorageConfig.storage;
    const basePath = this.contactFormStorageConfig.basePath;

    return this.mediaService.uploadMedia(multipartFile, storageType, basePath);
  }
}
