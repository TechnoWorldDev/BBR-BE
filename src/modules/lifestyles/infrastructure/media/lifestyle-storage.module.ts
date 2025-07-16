import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LifestyleStorageConfig } from './lifestyle-storage.config';

@Module({
  imports: [ConfigModule],
  providers: [LifestyleStorageConfig],
  exports: [LifestyleStorageConfig],
})
export class UserStorageModule {}
