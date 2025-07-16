import { Injectable, NotFoundException } from '@nestjs/common';
import { ICommandHandler } from 'src/shared/commandhandler/abstract-command-handler';
import { FetchContentCommandResult } from '../result/fetch-content.command.result';
import { IMediaService } from 'src/shared/media/media.service.interface';

@Injectable()
export class FetchContentCommandHandler
  implements ICommandHandler<string, FetchContentCommandResult>
{
  constructor(private readonly mediaService: IMediaService) {}

  async handle(id: string): Promise<FetchContentCommandResult> {
    const media = await this.mediaService.findById(id);
    if (!media) {
      throw new NotFoundException('Media not found');
    }

    const content = await this.mediaService.findContentById(media);
    return new FetchContentCommandResult(media, content);
  }
}
