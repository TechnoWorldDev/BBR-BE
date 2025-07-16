import { MediaStorage } from 'src/modules/media/domain/media.storage.interface';
import { MediaStorageType } from './media-storage-type.enum';
import { Injectable } from '@nestjs/common';
import { Media } from 'src/modules/media/domain/media.entity';

@Injectable()
export class LocalMediaStorageService implements MediaStorage {
  getType(): MediaStorageType {
    return MediaStorageType.LOCAL;
  }

  upload(savedMedia: Media, multipartFile: Express.Multer.File): Promise<void> {
    return Promise.resolve();
  }

  uploadStream(savedMedia: Media, dataStream: NodeJS.ReadableStream): Promise<void> {
    return Promise.resolve();
  }

  fetchContent(path: string): Promise<Buffer> {
    return Promise.resolve(Buffer.alloc(0));
  }

  getExternalUrl(media: Media): Promise<string> {
    return Promise.resolve('');
  }

  delete(url: string): Promise<void> {
    return Promise.resolve();
  }

  generateTemporalURL(media: Media): Promise<string> {
    return Promise.resolve('');
  }
}
