import { MediaCollectionType } from '../../domain/media-collection-type.enum';

export class UploadMediaCommand {
  constructor(
    public readonly multipartFile: Express.Multer.File,
    public readonly type: MediaCollectionType
  ) {}

  static of(multipartFile: Express.Multer.File, type: MediaCollectionType): UploadMediaCommand {
    return new UploadMediaCommand(multipartFile, type);
  }
}
