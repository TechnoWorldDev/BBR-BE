import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { IEventHandler } from 'src/shared/eventemitter/abstract-event-handler';
import { FileUploadCompletedEvent } from '../../domain/event/file-upload-completed.event';
import { MediaUploadStatus } from '../../domain/media-upload-status.enum';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { IMediaRepository } from '../../domain/media.repository.interface';
import { FileUploadErrorEvent } from '../../domain/event/file-upload-error.event';

@Injectable()
@LogMethod()
export class FileUploadErrorEventHandler extends IEventHandler<FileUploadErrorEvent> {
  constructor(private readonly mediaRepository: IMediaRepository) {
    super();
  }

  @OnEvent('file.upload.error')
  @LogMethod()
  async handle(event: FileUploadErrorEvent): Promise<void> {
    const mediaId = event.mediaId;
    await this.mediaRepository.updateUploadStatus(mediaId, MediaUploadStatus.ERROR);
  }
}
