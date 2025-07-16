import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ContactFormStorageConfig } from './contact-form-storage-config.service';

@Module({
  imports: [ConfigModule],
  providers: [ContactFormStorageConfig],
  exports: [ContactFormStorageConfig],
})
export class ContactFormStorageModule {}
