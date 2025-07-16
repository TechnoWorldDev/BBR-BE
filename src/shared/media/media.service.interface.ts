import { MimeType } from 'mime-types';
import { Readable } from 'stream';
import { MediaStorageType } from './storage/media-storage-type.enum';
import { Media } from 'src/modules/media/domain/media.entity';

export abstract class IMediaService {
  abstract uploadMedia(
    multipartFile: Express.Multer.File,
    storage: MediaStorageType,
    basePath: string
  ): Promise<Media | null>;

  abstract uploadMediaWithStream(
    originalFilename: string,
    size: number,
    contentType: MimeType,
    storage: MediaStorageType,
    basePath: string,
    dataStream: Readable
  ): Promise<Media | null>;

  abstract findById(id: string): Promise<Media | null>;

  abstract findContentById(media: Media): Promise<Buffer>;

  abstract deleteUnusedMediaCreatedAfterDate(date: Date): Promise<void>;

  abstract addTemporalUrl(media: Media): Promise<void>;

  abstract addTemporalUrls(media: Media[]): Promise<void>;

  abstract generateTemporalURL(media: Media): Promise<string>;
}
