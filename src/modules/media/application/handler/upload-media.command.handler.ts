import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ICommandHandler } from 'src/shared/commandhandler/abstract-command-handler';
import { UploadMediaCommand } from '../command/upload-media.command';
import { Media } from '../../domain/media.entity';
import { FileUploadService } from '../../infrastructure/file-upload.service';
import { parseFileType } from 'src/shared/media/config/file-type.enum';
import { DomainMediaStorage } from '../../domain/domain.media.storage';

@Injectable()
export class UploadMediaCommandHandler implements ICommandHandler<UploadMediaCommand, Media> {
  private storages: DomainMediaStorage[];

  constructor(
    private readonly fileUploadService: FileUploadService,
    @Inject('MEDIA_DOMAIN_STORAGE_SERVICES') storages: DomainMediaStorage[]
  ) {
    this.storages = storages ?? [];
  }

  async handle(command: UploadMediaCommand): Promise<Media> {
    if (command.multipartFile == null || command.type == null) {
      throw new BadRequestException('File and type cannot be null.');
    }

    const mimeType = command.multipartFile.mimetype;
    const fileType = parseFileType(mimeType);

    if (!this.fileUploadService.isFileTypeSupported(fileType, mimeType)) {
      throw new BadRequestException('Unsupported media mime type');
    }

    if (!this.fileUploadService.isFileSizeSupported(fileType, command.multipartFile.size)) {
      throw new BadRequestException('Size not supported.');
    }

    const storage = this.storages.find((s) => s.getCollectionType() === command.type);
    if (!storage) {
      throw new BadRequestException('Media storage is not valid.');
    }

    const media = await storage.uploadMedia(command.multipartFile);
    if (!media) {
      throw new InternalServerErrorException('Media not saved.');
    }

    return media;
  }
}
