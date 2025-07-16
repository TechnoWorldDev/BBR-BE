import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MediaLibraryS3Configuration {
  private readonly bucket: string;
  private readonly temporalUrlDuration: number;

  constructor(private readonly configService: ConfigService) {
    this.bucket = this.configService.get<string>('MEDIA_S3_BUCKET') || 'not_defined';
    this.temporalUrlDuration =
      this.configService.get<number>('MEDIA_S3_TEMPORAL_URL_DURATION') || 3600;
  }

  getBucket(): string {
    return this.bucket;
  }

  getTemporalUrlDuration(): number {
    return this.temporalUrlDuration;
  }
}
