import { MediaUploadStatus } from './media-upload-status.enum';
import { Media } from './media.entity';

export abstract class IMediaRepository {
  abstract create(media: Media): Promise<Media>;
  abstract findById(id: string): Promise<Media | undefined>;
  abstract findByIds(ids: string[]): Promise<Media[]>;
  abstract findActiveById(id: string): Promise<Media | null>;
  abstract updateExternalId(id: string, externalId: string): Promise<void>;
  abstract updateUploadStatus(id: string, uploadStatus: MediaUploadStatus): Promise<void>;
  abstract fetchUnusedMediaCreatedAfter(date: Date): Promise<Media[]>;
  abstract deleteByIds(ids: string[]): Promise<void>;
}
