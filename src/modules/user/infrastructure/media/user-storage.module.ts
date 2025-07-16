import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserStorageConfig } from './user-storage.config';

@Module({
  imports: [ConfigModule],
  providers: [UserStorageConfig],
  exports: [UserStorageConfig],
})
export class UserStorageModule {}
