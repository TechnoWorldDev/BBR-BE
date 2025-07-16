import { MediaUploadStatus } from '../../domain/media-upload-status.enum';

export class FindMediaUploadStatusByIdCommandResult {
  constructor(public readonly status: MediaUploadStatus) {}
}
