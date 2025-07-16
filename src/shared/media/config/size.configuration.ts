import { FileType } from './file-type.enum';

export abstract class SizeConfiguration {
  readonly mimeType: FileType;
  readonly size: number;

  constructor(mimeType: FileType, size: number) {
    this.mimeType = mimeType;
    this.size = size;
  }

  getMimeType(): FileType {
    return this.mimeType;
  }

  getSize(): number {
    return this.size;
  }

  isValidSize(fileSize: number): boolean {
    return this.size >= fileSize;
  }
}
