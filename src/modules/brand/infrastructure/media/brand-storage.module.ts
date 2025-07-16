import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BrandStorageConfig } from './brand-storage.config';

@Module({
  imports: [ConfigModule],
  providers: [BrandStorageConfig],
  exports: [BrandStorageConfig],
})
export class BrandStorageModule {}
