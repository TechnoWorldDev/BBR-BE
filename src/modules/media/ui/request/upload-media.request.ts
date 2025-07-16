import { IsNotEmpty } from 'class-validator';
import { MediaCollectionType } from '../../domain/media-collection-type.enum';

export class UploadMediaDto {
  @IsNotEmpty()
  multipartFile: Express.Multer.File;

  @IsNotEmpty()
  type: MediaCollectionType;

  constructor(multipartFile: Express.Multer.File, type: MediaCollectionType) {
    this.multipartFile = multipartFile;
    this.type = type;
  }
}
