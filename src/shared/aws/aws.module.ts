import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AwsProperties } from './aws-properties';

@Module({
  imports: [ConfigModule],
  providers: [AwsProperties],
  exports: [AwsProperties],
})
export class AwsModule {}
