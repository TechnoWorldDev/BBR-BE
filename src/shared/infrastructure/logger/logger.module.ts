import { Module, Global } from '@nestjs/common';
import { Logger } from './logger.service';
import { LoggingInterceptor } from './logging.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Global() // Make it globally available
@Module({
  providers: [
    Logger,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
  exports: [Logger],
})
export class LoggerModule {}
