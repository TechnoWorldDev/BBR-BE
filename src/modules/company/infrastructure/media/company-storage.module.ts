import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CompanyStorageConfig } from './company-storage.config';

@Module({
  imports: [ConfigModule],
  providers: [CompanyStorageConfig],
  exports: [CompanyStorageConfig],
})
export class CompanyStorageModule {}
