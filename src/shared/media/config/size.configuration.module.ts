import { Module } from '@nestjs/common';
import { SizeConfigurationFactory } from './size-configuration-factory';

@Module({
  providers: [SizeConfigurationFactory],
  exports: [SizeConfigurationFactory],
})
export class SizeConfigurationModule {}
