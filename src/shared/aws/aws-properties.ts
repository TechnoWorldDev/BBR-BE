import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AwsProperties {
  constructor(private configService: ConfigService) {}

  get accessKey(): string {
    const accessKey = this.configService.get<string>('AWS_ACCESS_KEY');
    if (!accessKey) {
      throw new InternalServerErrorException(
        'AWS_ACCESS_KEY is not defined in the environment variables.'
      );
    }
    return accessKey;
  }

  get secretKey(): string {
    const secretKey = this.configService.get<string>('AWS_SECRET_KEY');
    if (!secretKey) {
      throw new InternalServerErrorException(
        'AWS_SECRET_KEY is not defined in the environment variables.'
      );
    }
    return secretKey;
  }

  get region(): string {
    const region = this.configService.get<string>('AWS_REGION');
    if (!region) {
      throw new InternalServerErrorException(
        'AWS_REGION is not defined in the environment variables.'
      );
    }
    return region;
  }
}
