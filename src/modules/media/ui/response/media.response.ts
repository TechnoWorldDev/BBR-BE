export class MediaResponse {
  id: string;
  originalFileName: string;
  mimeType: string;
  uploadStatus: string;
  size: number;
  url: string;

  constructor(
    id: string,
    originalFileName: string,
    mimeType: string,
    uploadStatus: string,
    size: number,
    url: string
  ) {
    this.id = id;
    this.originalFileName = originalFileName;
    this.mimeType = mimeType;
    this.uploadStatus = uploadStatus;
    this.size = size;
    this.url = url;
  }
}
