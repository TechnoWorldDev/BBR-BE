import { Injectable, NotFoundException } from '@nestjs/common';
import { ICommandHandler } from 'src/shared/commandhandler/abstract-command-handler';
import { IMediaService } from 'src/shared/media/media.service.interface';
import { Media } from '../../domain/media.entity';
import { FindMediaUploadStatusByIdCommandResult } from '../result/find-media-upload-status.command.result';

@Injectable()
export class FindMediaUploadStatusByIdCommandQuery
  implements ICommandHandler<string, FindMediaUploadStatusByIdCommandResult>
{
  constructor(private readonly mediaService: IMediaService) {}

  async handle(id: string): Promise<FindMediaUploadStatusByIdCommandResult> {
    const media = await this.mediaService.findById(id);
    if (!media) {
      throw new NotFoundException('Media not found');
    }

    return new FindMediaUploadStatusByIdCommandResult(media.uploadStatus);
  }
}
