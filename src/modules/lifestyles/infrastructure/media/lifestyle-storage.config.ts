import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { fromString, MediaStorageType } from 'src/shared/media/storage/media-storage-type.enum';

@Injectable()
export class LifestyleStorageConfig {
  constructor(private configService: ConfigService) {}

  get storage(): MediaStorageType {
    return fromString(this.configService.get<string>('media.lifestyle.storage'));
  }

  get basePath(): string {
    return this.configService.get<string>('media.lifestyle.basePath') || 'undefined';
  }
}
