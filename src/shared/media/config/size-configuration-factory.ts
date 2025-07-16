import { Injectable } from '@nestjs/common';
import { FileType } from './file-type.enum';
import { ImageSizeConfiguration } from './image-size-configuration';
import { DocumentSizeConfiguration } from './document-size-configuration';
import { SizeConfiguration } from './size.configuration';

@Injectable()
export class SizeConfigurationFactory {
  get(mimeTypeEnum: FileType): SizeConfiguration | null {
    switch (mimeTypeEnum) {
      case FileType.IMAGE:
        return new ImageSizeConfiguration();
      case FileType.DOCUMENT:
        return new DocumentSizeConfiguration();
      default:
        return null; // If no match, return null
    }
  }
}
