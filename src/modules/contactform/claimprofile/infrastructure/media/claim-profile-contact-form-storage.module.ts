import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClaimProfileContactFormStorageConfig } from './claim-profile-contact-form-storage-config.service';

@Module({
  imports: [ConfigModule],
  providers: [ClaimProfileContactFormStorageConfig],
  exports: [ClaimProfileContactFormStorageConfig],
})
export class ClaimProfileContactFormStorageModule {}
