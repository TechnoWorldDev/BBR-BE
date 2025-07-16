export enum MediaStorageType {
  S3 = 'S3',
  LOCAL = 'LOCAL',
}

export function isValid(storage: string): boolean {
  return Object.values(MediaStorageType).includes(storage as MediaStorageType);
}

export function fromString(storage: string | undefined): MediaStorageType {
  if (storage === undefined) {
    throw new Error(`Invalid MediaStorageType: ${storage}`);
  }

  if (isValid(storage)) {
    return storage as MediaStorageType;
  }
  throw new Error(`Invalid MediaStorageType: ${storage}`);
}
