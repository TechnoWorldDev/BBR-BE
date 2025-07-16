import { Model } from 'objection';
import { MediaStorageType } from '../../../shared/media/storage/media-storage-type.enum';
import { MediaUploadStatus } from './media-upload-status.enum';

export class Media extends Model {
  id!: string;
  originalFileName!: string;
  uploadStatus!: MediaUploadStatus;
  storage!: MediaStorageType;
  basePath!: string;
  mimeType!: string;
  size!: number;
  externalId?: string;
  securedUrl: string;
  createdAt!: Date;
  updatedAt!: Date;
  deletedAt?: Date;

  static tableName = 'media';
  $beforeInsert() {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  $beforeUpdate() {
    this.updatedAt = new Date();
  }

  static async create(data: Partial<Media>): Promise<Media> {
    return await Media.query().insert(data).returning('*');
  }

  public getPath(): string {
    return `${this.basePath}/${this.id}/${this.originalFileName}`;
  }

  addSecuredUrl(securedUrl: string): void {
    if (securedUrl == null) {
      return;
    }

    this.securedUrl = securedUrl;
  }
}
