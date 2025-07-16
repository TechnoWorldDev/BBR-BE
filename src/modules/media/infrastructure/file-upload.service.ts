import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { FileType } from 'src/shared/media/config/file-type.enum';
import { FileUploadServiceConfiguration } from 'src/shared/media/config/file-upload-service-configuration';
import { SizeConfigurationFactory } from 'src/shared/media/config/size-configuration-factory';

@Injectable()
export class FileUploadService {
  constructor(
    private readonly factory: SizeConfigurationFactory,
    private readonly configuration: FileUploadServiceConfiguration
  ) {}

  isFileTypeSupported(fileType: FileType, mimeType: string): boolean {
    const allowedMimeTypesForFileType = this.configuration.getAllowedMimeTypesByFileType(fileType);
    return allowedMimeTypesForFileType?.includes(mimeType) ?? false;
  }

  isFileSizeSupported(fileType: FileType, fileSize: number): boolean {
    const sizeConfiguration = this.factory.get(fileType);

    if (!sizeConfiguration) {
      throw new InternalServerErrorException(
        `Size configuration not found for file type: ${fileType}`
      );
    }

    return sizeConfiguration.isValidSize(fileSize);
  }
}
