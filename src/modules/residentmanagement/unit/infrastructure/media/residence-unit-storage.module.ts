import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ResidenceUnitStorageConfig } from './residence-unit-storage-config.service';

@Module({
  imports: [ConfigModule],
  providers: [ResidenceUnitStorageConfig],
  exports: [ResidenceUnitStorageConfig],
})
export class ResidenceUnitStorageModule {}
