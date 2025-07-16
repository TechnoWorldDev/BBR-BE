export enum FileType {
  IMAGE = 'image',
  DOCUMENT = 'application',
}

export function parseFileType(mimeType: string): FileType {
  for (const fileType of Object.values(FileType)) {
    if (mimeType.startsWith(fileType)) {
      return fileType;
    }
  }
  throw new Error(`Unknown file type for mimeType: ${mimeType}`);
}
