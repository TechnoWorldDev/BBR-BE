import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AmenityStorageConfig } from './amenity-storage.config';

@Module({
  imports: [ConfigModule],
  providers: [AmenityStorageConfig],
  exports: [AmenityStorageConfig],
})
export class AmenityStorageModule {}
