import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ResidenceStorageConfig } from './residence-storage.config';

@Module({
  imports: [ConfigModule],
  providers: [ResidenceStorageConfig],
  exports: [ResidenceStorageConfig],
})
export class ResidenceStorageModule {}
