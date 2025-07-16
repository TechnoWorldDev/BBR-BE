import { Media } from './media.entity';
import { MediaCollectionType } from './media-collection-type.enum';

export interface DomainMediaStorage {
  getCollectionType(): MediaCollectionType;

  uploadMedia(multipartFile: Express.Multer.File): Promise<Media | null>;
}
