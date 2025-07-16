import { Injectable, NotFoundException } from '@nestjs/common';
import { ICommandHandler } from 'src/shared/commandhandler/abstract-command-handler';
import { IMediaService } from 'src/shared/media/media.service.interface';
import { Media } from '../../domain/media.entity';

@Injectable()
export class FindMediaByIdCommandQuery implements ICommandHandler<string, Media> {
  constructor(private readonly mediaService: IMediaService) {}

  async handle(id: string): Promise<Media> {
    const media = await this.mediaService.findById(id);
    if (!media) {
      throw new NotFoundException('Media not found');
    }

    await this.mediaService.addTemporalUrl(media);

    return media;
  }
}
