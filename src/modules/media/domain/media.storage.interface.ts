import { MediaStorageType } from '../../../shared/media/storage/media-storage-type.enum';
import { Media } from './media.entity';

export interface MediaStorage {
  getType(): MediaStorageType;

  upload(savedMedia: Media, multipartFile: Express.Multer.File): Promise<void>;

  uploadStream(savedMedia: Media, dataStream: NodeJS.ReadableStream): Promise<void>;

  fetchContent(path: string): Promise<Buffer>;

  getExternalUrl(media: Media): Promise<string>;

  delete(url: string): Promise<void>;

  generateTemporalURL(media: Media): Promise<string>;
}
