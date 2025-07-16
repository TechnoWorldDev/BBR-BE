import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RankingCategoryStorageConfig } from './ranking-category-storage.config';

@Module({
  imports: [ConfigModule],
  providers: [RankingCategoryStorageConfig],
  exports: [RankingCategoryStorageConfig],
})
export class RankingCategoryStorageModule {}
