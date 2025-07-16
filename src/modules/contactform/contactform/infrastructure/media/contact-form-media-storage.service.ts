import { Injectable } from '@nestjs/common';
import { MediaCollectionType } from 'src/modules/media/domain/media-collection-type.enum';
import { IMediaService } from 'src/shared/media/media.service.interface';
import { ContactFormStorageConfig } from './contact-form-storage-config.service';
import { Media } from 'src/modules/media/domain/media.entity';
import { DomainMediaStorage } from 'src/modules/media/domain/domain.media.storage';

@Injectable()
export class ContactFormMediaStorageService implements DomainMediaStorage {
  constructor(
    private readonly mediaService: IMediaService,
    private readonly contactFormStorageConfig: ContactFormStorageConfig
  ) {}

  getCollectionType(): MediaCollectionType {
    return MediaCollectionType.CONTACT_FORM;
  }

  async uploadMedia(multipartFile: Express.Multer.File): Promise<Media | null> {
    const storageType = this.contactFormStorageConfig.storage;
    const basePath = this.contactFormStorageConfig.basePath;

    return this.mediaService.uploadMedia(multipartFile, storageType, basePath);
  }
}
